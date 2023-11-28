const Reward = require('../schemas/Reward');
const User = require('../schemas/User');

/**
 * adds a reward with a particular `rewardName` to the user with a username of `username` 
 * 
 * @param {String} username - ID of the user
 * @param {String} rewardID - ID of reward to be added
 * @param {Boolean} rewardType - Type of reward as boolean: true is internal
 * @returns {Reward | undefined} newly added reward or undefined if cannot be updated
 */
 async function addOne(username, rewardID, rewardType) {
    try {
        await User.findOneAndUpdate(
            { user_name: username },
            { $push:
                {
                    user_rewards: {
                        reward: rewardID,
                        redeemed: !rewardType
                }
               }
            }
        );
        return await findOne(rewardID);
    } catch (error) {
        return undefined;
    }
}

/**
 * Finds a reward with a specific `id`
 * @param {String} id  - ID of the reward
 * @returns the reward with id `id`
 */
 async function findOne(id) {
    try {
        const reward = await Reward.findOne({
                _id: id,
            }); 
        return reward;
    } catch (error) {
        return undefined;
    }
}

/**
 * Finds a rward with a given reward name `rewardName`
 * 
 * @param {String} rewardName - name of the reward
 * @returns {Reward | undefined} - reward if it exists
 */
 async function findOneByName(rewardName) {
    try {
        const reward = await Reward.findOne({
                reward_name: rewardName,
            }); 
        return reward;
    } catch (error) {
        return undefined;
    }
}

/**
 * Gets all the rewards that exist in order from least expensive to most expensive
 * 
 * @returns {Reward[] | undefined} rewards that exist or undefined if not possible
 */
 async function getAll() {
    try {
        const rewards = await Reward.find();
        return rewards;
    } catch (error) {
        return undefined;
    }
}


module.exports = Object.freeze({
    addOne,
    findOne,
    findOneByName,
    getAll
});