const deeds_controller = require('../models/deed-controller');
const user_controller = require('../models/user-controller');
const rewards_controller = require('../models/reward-controller');
const DifficultyLevel = require('../models/difficultyLevels');


/**
 * Checks if a Deed can be created by a specific user
 *
 * @param {string} req - the HTTP request containing a body with the id of the Deed `id`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user doesn't have enough kudos to create a deed
 */
const canCreateDeed = async (req, res, next) => {
    const username = req.session.username;
    const helpers = req.body.helpersNeeded;
    const kudosCost = helpers * deeds_controller.calculateKudos(req.body.difficulty, req.body.estimatedHours);
    const user = await user_controller.findOneByUsername(username);
    if (user.user_kudos < kudosCost) {
        res.status(401).json({
            error: `You don't have enough kudos to create this deed!`,
        }).end();
        return;
    }
    const deeds = await deeds_controller.getAll() ?? [];
    for (const deed of deeds) {
        const currDate = new Date()
        const deedDate = new Date(deed.deed_date)
        if (deed.deed_requester.user_name === user.user_name && 
            deed.deed_completed === false && //TODO: update to status check
            currDate.getTime() > deedDate.getTime()) {
            res.status(401).json({
                error: `You must provide feedback on your other deed(s) before creating this deed!`,
            }).end();
            return;
        }
    }
    next();
}

/**
 * Checks if a Deed can be edited by a specific user
 *
 * @param {string} req - the HTTP request containing a body with the id of the Deed `id`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user doesn't have enough kudos to edit the deed
 */
const canEditDeed = async (req, res, next) => {
    const username = req.session.username;
    const deed = await deeds_controller.findOne(req.params.id);
    const user = await user_controller.findOneByUsername(username);
    const previousKudosCost = deed.deed_helpersNeeded * deed.deed_kudos;
    const newKudosCost = req.body.kudosCost;

    // If the difference in the new cost after deed is edited is greater
    // than the kudos the user has then, the user cannot edit the deed
    if (newKudosCost > previousKudosCost && user.user_kudos < (newKudosCost - previousKudosCost)) {
        res.status(401).json({
            error: `You don't have enough kudos to change to the difficulty, number of helpers, or estimated hours!`,
        }).end();
        return;
    }
    next();
}

/**
 * Checks if a Deed exists with a specific ID.
 *
 * @param {string} req - the HTTP request containing a body with the id of the Deed `id`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {404} - when the deed with the id `id` cannot be found
 */
const doesDeedIDExist = async (req, res, next) => {
    const id = req.params.id; 
    try {
        const deed = await deeds_controller.findOne(id);
        if (!deed) {
            res.status(404).json({
                error : "Deed was not found. Please try to delete later!",
            }).end();
            return; 
        }
    } catch(err) {
        res.status(404).json({
            error : "Deed was not found. Please try to delete later!",
        }).end();    
        return;
    }
    next();
};

/**
 * Checks if a user with a specific username exists 
 *
 * @param {string} req - the HTTP request containing a params with the username of the user `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {404} - when the user with username `username` could not be found
 */
 const doesUsernameExist = async (req, res, next) => {
    const username = req.params.username; 
    try {
        const user = await user_controller.findOneByUsername(username);
        if (!user) {
            res.status(404).json({
                error : "User could not be found!",
            }).end();
            return; 
        }
    } catch(err) {
        res.status(404).json({
            error : "User could not be found!",
        }).end();    
        return; 
    }
    next();
};

/**
 * Checks if one can get all deeds
 *
 * @param {string} req - the HTTP request containing a query with the requester ID `requester` and helper ID `helper`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {404} - when a `requester and `helper` field specified and user is not found with that ID
 */
const canGetAllDeeds =  async (req, res, next) => {
    if (req.query.requester || req.query.helper) {
        isUserIDValid(req, res, next);
        return;
    } 
    next();
};

/**
 * Checks if a user can remove
 *
 * @param {string} req - the HTTP request containing a body with the id of the Deed `id`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user can't remove themself from a Deed's helpers
 */
 const canRemoveHelpers = async (req, res, next) => {
    if (req.body.removeSelf !== true && req.body.removeHelper !== undefined) {
        const deed = await deeds_controller.findOne(req.params.id);
        const user = await user_controller.findOneByUsername(req.session.username);
        const currDate = new Date();
        const deedDate = new Date(deed.deed_date);
        if (user._id === deed.deed_requester._id && currDate >= deedDate) {
            res.status(401).json({
                error: `Must be a requester to remove helpers only after the Deed completion date.`,
            }).end();
            return;
        }
    }
    next();
}
  
/**
 * Checks if a Deed's date is valid that is it is not empty and is not in the past.
 *
 * @param {string} req - the HTTP request containing a body with the date of the Deed `date`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the date does not exist or is in the past in comparison to the current date
 */
const isDeedDateValid = (req, res, next) => {
    const now = new Date;
    const date = new Date(req.body.date);
    if (date === null || date === undefined) {
        res.status(400).json({
            error : "You must specify a date!",
        }).end();
        return;
    } else if (date < now) {
        res.status(400).json({
            error: 'Date must be in the future!'
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a Deed's content is valid that is it is not empty and has at least one character.
 *
 * @param {string} req - the HTTP request containing a body with the description of the Deed `description`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the content does not exist or is empty
 */
const isDeedDescriptionValid = (req, res, next) => {
    const description = req.body.description;
    if (description === null || description === undefined || description.length === 0) {
        res.status(400).json({
            error : "The description must have at least one character.",
        }).end();
        return;
    } else if (!description.trim()) {
        res.status(400).json({
            error: 'The content must have non-whitespace characters.'
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a Deed's difficulty is valid that is it is either 'low', 'medium', or 'high'
 *
 * @param {string} req - the HTTP request containing a body with the difficulty of the Deed `difficulty`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the difficulty is neither low, medium, or high
 */
const isDeedDifficultyValid = (req, res, next) => {
    const difficulty = req.body.difficulty;
    if (!Object.values(DifficultyLevel).includes(difficulty.toLowerCase())) {
        res.status(400).json({
            error : "Invalid difficulty, must be either low, medium, or high",
        }).end();
        return;
    } 
    next();
};

/**
 * Checks if a Deed's estimated hours is valid that is it is a number that is greater than or equal to 0
 *
 * @param {string} req - the HTTP request containing a body with the estimatedHours of the Deed `estimatedHours`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the estimatedHours is nonexistent, or is less than or equal to 0 
 */
const isDeedEstimatedHoursValid = (req, res, next) => {
    let estimatedHours = req.body.estimatedHours;
    if (estimatedHours === null || estimatedHours === undefined) {
        res.status(400).json({
            error : "Must specify the estimated hours of the Deed",
        }).end();
        return;    
    }
    estimatedHours = parseInt(estimatedHours, 10);
    if (parseInt(estimatedHours, 10) === 0) {
        res.status(400).json({
            error : "Estimated hours cannot be 0 ",
        }).end();
        return;
    } 
    else if (parseInt(estimatedHours, 10) < 0) {
    res.status(400).json({
        error : "Estimated hours cannot be negative",
    }).end();
    return;
    } 
    next();
};

/**
 * Checks if a Deed's helper amount is valid that is it is greater than 0 
 *
 * @param {string} req - the HTTP request containing a body with the helpersNeeded of the Deed `helpersNeeded`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the helper amount is nonexistent or less than or equal to 0
 */
const isDeedHelperAmountValid = (req, res, next) => {
    let helpersNeeded = req.body.helpersNeeded;
    if (helpersNeeded === null || helpersNeeded === undefined) {
        res.status(400).json({
            error : "Must specify the number of helpers needed",
        }).end();
        return;    
    }
    helpersNeeded = parseInt(helpersNeeded, 10);
    if (helpersNeeded === 0) {
        res.status(400).json({
            error : "Number of helpers cannot be 0 ",
        }).end();
        return;
    } 
    else if (helpersNeeded < 0) {
    res.status(400).json({
        error : "Number of helpers cannot be negative",
    }).end();
    return;
    } 
    next();
};

/**
 * Checks if a Deed's location (street address) is not empty and has at least one character.
 *
 * @param {string} req - the HTTP request containing a body with the location of the Deed `location`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the location does not exist or is empty
 */
const isDeedLocationValid = (req, res, next) => {
    const location = req.body.location;
    if (location === null || location === undefined || location.length === 0) { 
        res.status(400).json({
            error : "Please input a valid street address",
        }).end();
        return;
    } 
    else if (!location.trim()) {
        res.status(400).json({
            error: 'The street address must have non-whitespace characters'
        }).end();
        return;
    }
    next();
}

/**
 * Checks if a request is made by the user that originally created/requested the Deed
 *
 * @param {string} req - the HTTP request containing a body with the title of the Deed `title`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {403} - when the user tries to make changes to a Deed but is not the requester
 */
const isDeedRequester = async (req, res, next) => {
    const id = req.body.id ?? req.params.id;
    const deed = await deeds_controller.findOne(id);
    const isFreetAuthor = req.session.userID == deed.deed_requester._id;
    if (!isFreetAuthor) {
        res.status(403).json({
            error: `You must be the requester of the Deed to make changes`
        }).end();
        return
    }   
    next();  
}

/**
 * Checks if a Deed's title is not empty and has at least one character.
 *
 * @param {string} req - the HTTP request containing a body with the title of the Deed `title`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the title does not exist or is empty
 */
 const isDeedTitleValid = (req, res, next) => {
    const title = req.body.title;
    if (title === null || title === undefined || title.length === 0) {
        res.status(400).json({
            error : "The title must have at least one character.",
        }).end();
        return;
    } else if (!title.trim()) {
        res.status(400).json({
            error: 'The title must have non-whitespace characters.'
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User's password has at least one character and is not already used
 *
 * @param {string} req - the HTTP request containing a body with the password `password`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the password does not exist or is empty
 */
 const isPasswordValid = async (req, res, next) => {
    const password = req.body.password;
    if (password === null || password === undefined || password.length === 0) {
        res.status(400).json({
            error : "The password must not be empty.",
        }).end();
        return;
    } else if (!password.trim()) {
        res.status(400).json({
            error: 'The password must have non-whitespace characters.'
        }).end();
        return;
    }
    next();
};

/**
 * Checks whether a user's phone number is unique upon sign up
 *
 * @param {string} req - the HTTP request containing a body with the body `phoneNumber`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when `phoneNumber` is undefined, null, or of length 0  
 *               - when a user that already exists has a phone number `phoneNumber`
 */
 const isPhoneNumberValid = async (req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    const phoneNumRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneNumber || phoneNumber.length === 0 || !phoneNumber.match(phoneNumRegex)) {
        res.status(400).json({
            error : "You must include a valid phone number.",
        }).end();
        return;
    } 
    const user = await user_controller.findOneByPhoneNumber(phoneNumber);
    if (user) {
        res.status(400).json({
            error: 'A user with that phone number already exists',
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User is currently logged in
 *
 * @param {string} req - the HTTP request containing a body with the description of the User `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {404} - when the user was not found
 */
 const isUserIDValid = async (req, res, next) => {
    const id = req.query.requester ?? req.query.helper ?? req.params.userID; 
    try {
        const user = await user_controller.findOne({
            _id: id,
        });
        if (!user) {
            res.status(404).json({
                error : "User was not found. Please try to view a different user!",
            }).end();
            return; 
        }
    } catch(err) {
        res.status(404).json({
            error : "User was not found. Please try to view a different user!",
        }).end();   
        return; 
    }
    next();
};

/**
 * Checks if `username` is unique and no other users have that username.
 *
 * @param {string} req - the HTTP request containing a body with the username `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {403} - when another user has the same username `username`
 */
 const isUsernameUnique = async (req, res, next) => {
    const username = req.body.username;
    const user = await user_controller.findOneByUsername(username);
    if (user != null) {
        res.status(403).json({
            error: `Sorry, a user with username ${username} already exists`
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User's name has at least one character.
 *
 * @param {string} req - the HTTP request containing a body with the description of the User `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the username does not exist or is empty
 */
const isUsernameValid = async (req, res, next) => {
    const username = req.body.username;
    if (username === null || username === undefined || username.length === 0) {
        res.status(400).json({
            error : "The username must not be empty.",
        }).end();
        return;
    } else if (!username.trim()) {
        res.status(400).json({
            error: 'The username must have non-whitespace characters.'
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User is currently logged in
 *
 * @param {string} req - the HTTP request containing a body with the description of the User `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user is not logged in
 */
const isUserLoggedIn = (req, res, next) => {
    if (req.session.userID == null) {
        res.status(401).json({
            error: `You must be logged in first!`,
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User is logged out.
 *
 * @param {string} req - the HTTP request 
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - if username is null or undefined
 */
 const isUserLoggedOut = (req, res, next) => {
    if (req.session.username != null) {
        res.status(400).json({
            error: 'You are already logged in!'
        }).end();
        return;
    }
    next();
};

/**
 * Checks that the username and password pairing match an existing user's credentials. 
 *
 * @param {string} req - the HTTP request containing the username and password for user log in
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - if credentials don't match up
 */
const isValidLogin = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const isValid = await user_controller.checkCredentials(username, password);
    if (!isValid) {
        res.status(400).json({
            error: 'The username or password you entered is incorrect.'
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a Feedback's review is valid that is it is not empty and has at least one character.
 *
 * @param {string} req - the HTTP request containing a body with the description of the Deed `description`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {400} - when the content does not exist or is empty
 */
 const isFeedbackReviewValid = (req, res, next) => {
    const review = req.body.review;
    if (review === null || review === undefined || review.length === 0) {
        res.status(400).json({
            error : "The feedback review must have at least one character.",
        }).end();
        return;
    } else if (!review.trim()) {
        res.status(400).json({
            error: 'The feedback review must have non-whitespace characters.'
        }).end();
        return;
    }
    next();
};

/** Checks if a reward with a specific reward name exists
 * @param {string} req - the HTTP request containing the reward name 'reward_name'
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {404} - when the reward with username `reward_name` could not be found
 */
const doesRewardExist = async (req, res, next) => {
    try {
        const reward = await rewards_controller.findOne(req.body.rewardID);
        if (!reward) {
            res.status(404).json({
                error : "Reward could not be found!",
            }).end();
            return; 
        }
    } catch(err) {
        res.status(404).json({
            error : "Reward could not be found!",
        }).end();    
        return; 
    }
    next();
};

/**
 * Checks if reward can be acquired by logged in user.
 * @param {string} req - the HTTP request containing a body with the name of the reward `reward_name`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user doesn't have enough kudos to acquire the reward 
 */
const canAcquireReward = async (req, res, next) => {
    const username = req.session.username;
    const reward = await rewards_controller.findOne(req.body.rewardID);
    const user = await user_controller.findOneByUsername(username);
    if (user.user_kudos < reward.kudos_value) {
        res.status(401).json({
            error: `You don't have enough kudos to acquire this reward!`,
        }).end();
        return;
    }
    next();
};

/**
 * Checks if a User is currently logged in, but only if we are trying to view rewards by user
 *
 * @param {string} req - the HTTP request containing a body with the description of the User `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user is not logged in
 */
 const isUserLoggedInRewards = (req, res, next) => {
    if  (req.query.byUser) {
        if (req.session.userID == null) {
            res.status(401).json({
                error: `You must be logged in first!`,
            }).end();
            return;
        }
    }
    next();
};

/**
 * Checks if a User is trying to only view unredeemed or unexpired rewards without specifying byUser
 *
 * @param {string} req - the HTTP request containing a body with the description of the User `username`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user wants to filter rewards that are not associated with a particular user
 */
 const byUserValidFiltering = (req, res, next) => {
    if  (!req.query.byUser) {
        if (req.query.unredeemedOnly || req.query.unexpiredOnly) {
            res.status(401).json({
                error: `You must be be viewing rewards associated with a user to specify filtering parameters!`,
            }).end();
            return;
        }
    }
    next();
};

/**
 * Checks if a user can be remove themselves from a Deed's helpers
 *
 * @param {string} req - the HTTP request containing a body with the id of the Deed `id`
 * @param {string} res - the HTTP response
 * @param {Object} next - the next middleware function in the application's response cycle
 * @throws {401} - when the user can't remove themself from a Deed's helpers
 */
 const canRemoveSelfFromHelpers = async (req, res, next) => {
    if (req.body.removeSelf === true) {
        const deed = await deeds_controller.findOne(req.params.id);
        const currDate = new Date()
        const deedDate = new Date(deed.deed_date)
        deedDate.setDate(deedDate.getDate()-1);
        if (currDate > deedDate) {
            res.status(401).json({
                error: `You can not remove yourself from this deed's helpers within 24 hours of the deadline. Please contact the requester.`,
            }).end();
            return;
        }
    }
    next();
}


module.exports = Object.freeze({
    canCreateDeed,
    canEditDeed,
    doesDeedIDExist,
    doesUsernameExist,
    canGetAllDeeds,
    canRemoveHelpers,
  isDeedDateValid,
  isDeedDescriptionValid,
  isDeedDifficultyValid,
  isDeedEstimatedHoursValid,
  isDeedHelperAmountValid,
  isDeedLocationValid,
  isDeedRequester,
  isDeedTitleValid,
  isPasswordValid,
  isPhoneNumberValid,
  isUserIDValid,
  isUsernameUnique,
  isUsernameValid,
  isUserLoggedIn,
  isUserLoggedOut,
  isValidLogin,
  isFeedbackReviewValid,
  doesRewardExist,
  canAcquireReward,
  isUserLoggedInRewards,
  byUserValidFiltering,
  canRemoveSelfFromHelpers
});