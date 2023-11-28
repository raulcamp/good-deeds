const User = require('../schemas/User');

/**
 * Creates a new User
 * 
 * @param {string} username - username
 * @param {string} password - password
 * @param {string} email - user email address
 * @param {string} phoneNumber - user phone number
 * @returns {User | undefined} newly created user or undefined if cannot be added
 */
async function addOne(username, password, email, phoneNumber) {
    try {
        const user = new User({
            user_name: username,
            user_password: password,
            user_phoneNumber: phoneNumber,
            user_email: email,
            user_kudos: 100,
            user_rewards: [],
        });
        await user.save();
        return user;
    } catch (error) {
        return undefined;
    };
}

/**
 * Finds a user with a given id
 * 
 * @param {String} id - id of the user
 * @returns {User | undefined} - user if it exists
 */
 async function findOne(id) {
    try {
        const user = await User.findOne({
            _id: id,
        }).populate('user_rewards.reward');
        return user;
    } catch(err) {
        return false;
    }
}

/**
 * Finds a user with a given id
 * 
 * @param {String} username - username of the user
 * @returns {User | undefined} - user if it exists
 */
async function findOneByUsername(username) {
    try {
        const user = await User.findOne({
            user_name: username,
        }).populate('user_rewards.reward');
        return user;
    } catch(err) {
        return undefined;
    }
}

/**
 * Finds a user with the phone number `phoneNumber`
 * 
 * @param {Number} phoneNumber - username of the user
 * @returns {User | undefined} - if one exists, user with the associated phone number `phoneNumber`; 
 *                              otherwise undefined
 */
 async function findOneByPhoneNumber(phoneNumber) {
    try {
        const user = await User.findOne({
            user_phoneNumber: phoneNumber,
        }).populate('user_rewards.reward');
        return user;
    } catch(err) {
        return undefined;
    }
}

/**
 * Checks if the username and password pairing is a valid existing user.
 * 
 * @param {String} username - username specified in login
 * @param {String} password - password specified in login
 * @returns {Boolean} True if the username and password match
 */
async function checkCredentials(username, password) {
    const user = await findOneByUsername(username);
    if (user == null) {
        return false;
    }
    return user.user_password === password;
}

/**
 * Decrements the number of kudos by `amount` for user with `username`  
 * 
 * @param {String} username - username to decrease kudos of
 * @param {Number} amount - how much to decrease kudos by
 * @returns {Number} new kudos amount for user after decrement
 */
async function decrementKudos(username, amount) {
    const user = await findOneByUsername(username);
    user.user_kudos = user.user_kudos - amount;
    user.save();
    return user.user_kudos;
}

/**
 * Increments the number of kudos by `amount` for user with `username`  
 * 
 * @param {String} username - username to increase kudos of
 * @param {Number} amount - how much to increase kudos by
 * @returns {Number} new kudos amount for user after increment
 */
 async function incrementKudos(username, amount) {
    const user = await findOneByUsername(username);
    user.user_kudos = user.user_kudos + amount;
    user.save();
    return user.user_kudos;
}

/**
 * Update the number of kudos for user with `username` after deed is edited
 * 
 * @param {String} username - username to increase kudos of
 * @param {Number} prevKudosCost - how much kudos cost with previous details
 * @param {Number} newKudosCost - how much kudos cost after updated details
 * @returns {Number} new kudos amount updated for user
 */
async function updateKudos(username, prevKudosCost, newKudosCost) {
    const user = await findOneByUsername(username);
    if (prevKudosCost > newKudosCost) {
        user.user_kudos = user.user_kudos + (prevKudosCost - newKudosCost);
    } else {
        user.user_kudos = user.user_kudos - (newKudosCost - prevKudosCost);
    }
    user.save();
    return user.user_kudos;
}

/**
 * Updates a users's recieved feedback 
 * 
 * @param {Object} user - user to be updated
 * @param {Object} feedback - feedback
 * @returns {User | undefined} newly updated user or undefined if cannot be updated
 */
 async function updateRecievedFeedback(user, feedback) {
    try {
        await User.findOneAndUpdate(
            { _id: user._id },
            { $push:
               {
                 feedback_recieved: feedback._id,
               }
            }
        );
        return;
    } catch(err) {
        return undefined;
    }
}

/**
 * Updates a users's recieved feedback 
 * 
 * @param {Object} user - user to be updated
 * @param {Object} feedback - feedback
 * @returns {User | undefined} newly updated user or undefined if cannot be updated
 */
 async function updateGivenFeedback(user, feedback) {
    try {
        await User.findOneAndUpdate(
            { _id: user._id },
            { $push:
               {
                 feedback_given: feedback._id 
               }
            }
        );
        return;
    } catch(err) {
        return undefined;
    }
}

module.exports = Object.freeze({
    addOne,
    findOne,
    findOneByUsername,
    findOneByPhoneNumber,
    checkCredentials,
    decrementKudos,
    incrementKudos,
    updateKudos,
    updateRecievedFeedback,
    updateGivenFeedback,
});