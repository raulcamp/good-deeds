const users_controller = require('../models/user-controller');
const rewards_controller = require('../models/reward-controller');
const express = require('express');
const router = express.Router();
const validator = require('./middleware');

/**
 * Get a list of all rewards logged in user has acquired OR
 * Get all rewards available to acquire.
 * @name GET /api/rewards/
 * 
 * @param {boolean} byUser - if true, return all rewards logged in user has acquired
 * @param {boolean} unredeemedOnly - if true, return only rewards logged in user has acquired and not yet redeemed
 * @param {boolean} unexpiredOnly - if true, return only rewards logged in user has acquired that have not yet expired
 * @throws {404} - if byUser is true and user is not logged in
 */
router.get('/', [
    validator.isUserLoggedInRewards,
    validator.byUserValidFiltering
],
async (req, res) => {
    const byUser = req.query.byUser;
    if (byUser) {
        const user = await users_controller.findOneByUsername(req.session.username);
        var filteredRewards = user.user_rewards;
        if (req.query.unredeemedOnly) {
            filteredRewards = filteredRewards.filter(reward => reward.redeemed);
        }
        if (req.query.unexpiredOnly) {
            filteredRewards = filteredRewards.filter(reward => reward.expiry_date > Date.now());
        }
        res.status(200).json({
            message: `You have successfully got the user rewards`,
            rewards: filteredRewards ?? [],
        }).end();
    }
    else {
        const rewards = await rewards_controller.getAll() ?? [];
        res.status(200).json({
            message: `You have successfully got all the rewards`,
            rewards: rewards,
        }).end();
    }
});

module.exports = router;