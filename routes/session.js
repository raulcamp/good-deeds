const controller = require('../models/user-controller');
const express = require('express');
const validator = require('./middleware');

const router = express.Router();


/**
 * Get a username in the session
 *
 * @name GET /api/session/
 *
 * @throws {401} - if the user is not already logged in
 */
router.get('/',
async (req, res) => {
    const username = req.session.username;
    const user = await controller.findOneByUsername(username);
    res.status(200).json({
        user: user ?? { userID: '', user_name: '' },
    }).end();
});

/**
 * Sign in a user
 *
 * @name POST /api/session
 *
 * @param {string} username - username
 * @param {string} password - password
 * @return {201} - successfully updated user
 * @throws {403} - if the user is already logged in
 * @throws {400} - if username or password is not filled
 * @throws {404} - if the username is not found
 * @throws {401} - if the password does not match
 */
router.post('/',
[
 validator.isUserLoggedOut,
 validator.isValidLogin,
],
async (req, res) => {
    const username = req.body.username;
    const user = await controller.findOneByUsername(username);
    req.session.username = user.user_name;
    req.session.userID = user._id;
    res.status(201).json({
        message: `You have succesfully signed in!`,
        user: user,
    }).end();
});

/**
 * Sign out a user.
 *
 * @name DELETE /api/session
 *
 * @param {string} userID - userID in the session
 * @throws {401} - if the user is not logged in
 */
router.delete('/',
[
 validator.isUserLoggedIn,
],
async (req, res) => {
    req.session.username = undefined;
    req.session.userID = undefined;
    res.status(200).json({
        message: 'You are signed out.'
    }).end();
});

module.exports = router;