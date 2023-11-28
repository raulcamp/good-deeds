const deeds_controller = require('../models/deed-controller');
const users_controller = require('../models/user-controller');
const feedback_controller = require('../models/feedback-controller');
const express = require('express');
const router = express.Router();
const validator = require('./middleware');

/**
 * Create feedback
 *
 * @name POST /api/feedback/
 *
 * @param {string} username - username of user giving feedback
 * @param {string} review - feedback
 * @param {string} mood - satisfaction of the user's performance
 * @param {string} deed - deed associated with the user
 * @return {201} - successfully created feedback
 * @throws {400} - if a field is missing
 * @throws {401} - when the user giving feedback is not logged in
 */
router.post('/',
    [
        validator.isUserLoggedIn,
        validator.isFeedbackReviewValid,
    ],
    async (req, res) => {
        const userGiver = await users_controller.findOneByUsername(req.session.username);
        const username = req.body.username;
        const userReciever = await users_controller.findOneByUsername(username);
        const review = req.body.review;
        const mood = req.body.mood;
        const deedID = req.body.deed_id;
        const deed = await deeds_controller.findOne(deedID);
        const feedback = await feedback_controller.addOne(userGiver, userReciever, review, mood, deed);
        if (!feedback) {
            res.status(403).json({
                error: 'Feedback could not be created at this time. Please try again later',
            });
            return;
        }
        await users_controller.updateRecievedFeedback(userReciever, feedback);
        await users_controller.updateGivenFeedback(userGiver, feedback);
        const updatedDeed = await deeds_controller.addUserToDeedFeedbacks(deed, userGiver);
        res.status(201).json({
            message: `You have succesfully given feedback!`,
            feedback: feedback,
        }).end();
    });

/**
 * Get all feedback
 *
 * @name GET /api/feedback/
 * @param {string} giver username of user giving feedback
 * @param {string} receiver username of user recieving feedback
 * @return {Feedback[]} list of all feedback. If giver is specified, it will get the deeds that user with username `giver`
 *  has given. If reciever is specified, it will get the feedback the user with username `reciever` has recieved. 
 *
 */
router.get('/',
    async (req, res) => {
        const giver = req.query.from;
        const receiver = req.query.to;
        let feedbacks;
        if (giver !== undefined) {
            const user = await users_controller.findOneByUsername(giver)
            feedbacks = await feedback_controller.findGivenFeedback(user);
        } else if (receiver !== undefined) {
            const user = await users_controller.findOneByUsername(receiver)
            feedbacks = await feedback_controller.findRecievedFeedback(user);
        } else {
            res.status(403).json({
                error: 'Did not specify kind of feedback associated with user (i.e. giver or reciever)',
            });    
        }
        res.status(200).json(feedbacks);
    }
);

module.exports = router;