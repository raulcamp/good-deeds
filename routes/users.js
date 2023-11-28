const users_controller = require('../models/user-controller');
const rewards_controller = require('../models/reward-controller');
const express = require('express');
const router = express.Router();
const validator = require('./middleware');

/**
 * Create a user
 *
 * @name POST /api/user/
 *
 * @param {string} username - username
 * @param {string} password - password
 * @param {string} email - user email address
 * @param {string} phoneNumber - user phone number
 * @return {201} - successfully created user
 * @throws {400} - if the user is already logged in
 *               - if a field is missing
 *               - when `phoneNumber` is undefined, null, or of length 0  
 *               - when a user that already exists has a phone number `phoneNumber`
 * @throws {409} - if the username is already taken
 */
router.post('/',
[
 validator.isUsernameValid,
 validator.isPasswordValid,
 validator.isUsernameUnique,
 validator.isPhoneNumberValid,
],
async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const phoneNumberInt = phoneNumber.replace(/\D/g, "");
    const user = await users_controller.addOne(username, password, email, phoneNumberInt);
    if (!user) {
        res.status(403).json({
            error: 'User could not be created at this time. Please try again later',
        });
        return;
    }
    req.session.username = user.user_name;
    req.session.userID = user._id;
    res.status(201).json({
        message: `You have succesfully signed up!`,
        user: user,
    }).end();
});

/**
 * Get a user with given username
 *
 * @name GET /api/user/:username?
 *
 * @throws {404} - when the user with username `username` could not be found
 */
router.get('/:username?', [
    validator.doesUsernameExist
],
    async (req, res) => {
        const user = await users_controller.findOneByUsername(req.params.username);
        res.status(200).json(user).end();
    }
);

/**
 * Update a user with a new reward
 * 
 * @name PATCH /api/user/
 * @param {string} reward_name - name of reward
 * @throws {400} - when the reward name is invalid
 * @throws {401} - when the user is not logged in or doesn't have enough kudos to acquire the reward
 */
router.patch('/', 
[
    validator.isUserLoggedIn,
    validator.doesRewardExist,
    validator.canAcquireReward,
],
async (req, res) => {
    const reward = await rewards_controller.findOne(req.body.rewardID);
    const newKudosAmount = await users_controller.decrementKudos(req.session.username, reward.kudos_value);
    const userReward = await rewards_controller.addOne(req.session.username, req.body.rewardID, reward.internal_reward_source);
    if (!userReward) {
        res.status(403).json({
            error: 'Reward could not be acquired at this time. Please try again later',
        });    
        return;  
    }
    res.status(201).json({
        message: `You have succesfully acquired your reward!`,
        userReward: userReward,
        kudos: newKudosAmount,
    }).end();
});

module.exports = router;