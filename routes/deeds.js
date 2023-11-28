const deeds_controller = require('../models/deed-controller');
const users_controller = require('../models/user-controller');
const express = require('express');
const router = express.Router();
const validator = require('./middleware');

/**
 * Creates a new Deed 
 * 
 * @name POST /api/deeds
 * 
 * @param {Date} date - the date associated to the deed, including time
 * @param {string} description - the description of the deed
 * @param {string} difficulty - the difficulty of the deed either LOW, MEDIUM, or HIGH
 * @param {int} estimatedHours - the estimated hours for the deed
 * @param {number} helperAmount - the amount of helpers that are needed 
 * @param {number} latitude - the latitude of the location
 * @param {number} longitude - the longitude of the location
 * @param {string} location - the location where the deed will take place in 
 * @param {string} title - the title of the deed
 * @throws {400} - when the date does not exist or is in the past in comparison to the current date
 *               -  when the content does not exist or is empty
 *               -  when the estimatedHours is nonexistent, or is less than or equal to 0 
 *               - when the helper amount is nonexistent or less than or equal to 0
 *               - when the title does not exist or is empty
 * @throws {401} - when the user is not logged in or doesn't have enough kudos to create the deed
 * @throws {403} - when deed could not be created despite having valid fields
 */
router.post('/', 
    [
        validator.isUserLoggedIn,
        validator.isDeedTitleValid, 
        validator.isDeedDescriptionValid,
        validator.isDeedDateValid,
        validator.isDeedDifficultyValid,
        validator.isDeedEstimatedHoursValid,
        validator.isDeedHelperAmountValid,
        validator.isDeedLocationValid,
        validator.canCreateDeed,
    ], 
    async (req, res) => { 
        const helpers = req.body.helpersNeeded;
        const kudosCost = helpers * deeds_controller.calculateKudos(req.body.difficulty, req.body.estimatedHours);
        const newKudosAmount = await users_controller.decrementKudos(req.session.username, kudosCost);
        const deeds = await deeds_controller.getAll();
        const deed = await deeds_controller.addOne(deeds, req.body);
        if (!deed) {
            res.status(403).json({
                error: 'Deed could not be created at this time. Please try again later',
            });    
            return;  
        }
        res.status(201).json({
            message: `You have succesfully created your deed!`,
            deed: deed,
            kudos: newKudosAmount,
        }).end();
});

/**
 * Get all deeds
 * 
 * @name GET /api/deeds
 * @param {string} requester - userID of the user 
 * @param {string} helper - username of the user
 * @param {Boolean} forProfile - if true, then we only get filled or unexpired deeds
 * @param {Boolean} forHome - if true, then we only get open and unexpired only
 * @return {Deeds[]} list of all the deeds. If requester is specified, it will get the deeds that user with ID `requester`
 *  has created. If helper is specified, it will get the deeds the user with ID `helper` is a helper in. 
 * @throws {404} - when a `requester field or `helper` field is specified and user is not found with that ID
 */
 router.get('/', [
     validator.canGetAllDeeds
    ], async (req, res) => { 
    const requester = req.query.requester;
    const helper = req.query.helper; 
    const forProfile = req.query.forProfile;
    const deeds = await deeds_controller.getAll() ?? [];
    let filteredDeeds;
    if (requester !== undefined) {
        if (forProfile) {
            filteredDeeds = deeds.filter(d => {
                return (d.deed_requester._id == requester) && (d.deed_helpers.length > 0 || d.deed_date > Date.now())
            });
        }
        else {
            filteredDeeds = deeds.filter(d => d.deed_requester._id == requester);
        }
    } else if (helper !== undefined) {
        filteredDeeds = deeds.filter(d => { 
            return d.deed_helpers.map(helper => helper._id).filter(id => id == helper).length > 0;
        });
    } else {
        filteredDeeds = deeds.filter(d => {
            return d.deed_helpers.length < d.deed_helpersNeeded && new Date(d.deed_date) > Date.now();
        })
    }
     res.status(200).json({
         message: `You have successfully got all the deeds`,
         deeds: deeds,
         filteredDeeds: filteredDeeds ?? [],
     }).end();
});

/**
 * Updates the deed with a specific id. 
 * 
 * @name PATCH /api/deeds
 * @throws {401} - when the user is not logged in
 * @throws {403} - when the user is not the requester of the deed with id `id` 
 * @throws {404} - when deed with id `id` could not be found
 */
 router.patch('/:id?', 
    [
     validator.isUserLoggedIn,
     validator.doesDeedIDExist,
     validator.canEditDeed,
     validator.canRemoveSelfFromHelpers,
     validator.canRemoveHelpers,
    ],
    async (req, res) => {
        const deed = await deeds_controller.findOne(req.params.id);
        // Increment kudos for helpers
        if (req.body.reviewee !== undefined) {
            const updatedDeed = await deeds_controller.addUserToDeedFeedbacks(deed, req.body.reviewee);
            if (req.body.completed) {
                deed.deed_helpers.forEach(async (helper) => {
                    await users_controller.incrementKudos(helper.user_name, deed.deed_kudos);
                });
            }
        }
        // Recalculate deed requester's kudos if difficulty, helpers, or estimated hours is changed
        let newRequesterKudos;
        if (req.body.kudosCost !== undefined) {
            const previousKudosCost = deed.deed_helpersNeeded * deed.deed_kudos;
            const newKudosCost = req.body.kudosCost;
            if (previousKudosCost !== newKudosCost) {
                newRequesterKudos = await users_controller.updateKudos(
                    req.session.username, previousKudosCost, newKudosCost
                );
            }
        }
        // Update or add/remove helper
        let updatedDeed;
        if (req.body.newHelper !== undefined) {
            updatedDeed = await deeds_controller.addDeedHelper(deed, req.body.newHelper);
        } else if (req.body.removeHelper !== undefined) {
            updatedDeed = await deeds_controller.removeDeedHelper(deed, req.body.removeHelper);
        } else {
            const deeds = await deeds_controller.getAll();
            updatedDeed = await deeds_controller.updateOne(deeds, deed, req.body);
        }
        res.status(200).json({ 
            message: `You have succesfully updated your Deed.`,
            deed: updatedDeed,
            kudos: newRequesterKudos,
        }).end();
});

/**
 * Deletes the deed with a specific id. 
 * 
 * @name DELETE /api/deeds
 * @throws {401} - when the user is not logged in
 * @throws {403} - when the user is not the requester of the deed with id `id 
 * @throws {404} - when the deed to delete cannot be found
 */
 router.delete('/:id?', 
    [
        validator.isUserLoggedIn,
        validator.doesDeedIDExist,
        validator.isDeedRequester,
    ], 
    async (req, res) => {
        const deed = await deeds_controller.findOne(req.params.id);
        const newKudos = await users_controller.incrementKudos(req.session.username, deed.deed_kudos);
        const id = await deeds_controller.deleteOne(req.params.id);
        // Return kudos to user, since deeds can only be deleted when no help has been offered
        res.status(200).json({ 
            message: `You have succesfully deleted your Deed.`,
            id: id,
            kudos: newKudos,
        }).end();
 });



module.exports = router;