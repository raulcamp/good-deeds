const Feedback = require('../schemas/Feedback');
const mongoose = require("mongoose");

/**
 * Creates a new Feedback
 * 
 * @param {Object} fromUser - user giving feedback
 * @param {Object} toUser - user receiving feedback
 * @param {string} review - feedback
 * @param {string} mood - satisfaction of the user's performance
 * @param {Object} deed - deed associated with the feedback
 * @returns {Feedback | undefined} newly created feedback or undefined if cannot be created
 */
 async function addOne(fromUser, toUser, review, mood, deed) {
    try {
        const feedback = new Feedback({
            from_user: fromUser,
            to_user: toUser,
            mood: mood,
            review: review,
            deed: deed,
        });
        await feedback.save();
        return feedback;
    } catch (error) {
        return undefined;
    };
}

/**
 * Gets all feedback created by user
 * 
 * @param {Object} user - the user
 * @returns {Feedback[] | undefined } feedback that exist or undefined if not possible
 */
 async function findGivenFeedback(user) {
    try {
        const feedbacks = await Feedback.aggregate([
            { $match: { from_user: mongoose.Types.ObjectId(user._id) } },
            {$lookup:
                {
                    from: 'users',
                    localField: 'from_user',
                    foreignField: '_id',
                    as: 'from_user'
                },     
            },
            { $unwind: '$from_user' },
            {$lookup:
                {
                    from: 'users',
                    localField: 'to_user',
                    foreignField: '_id',
                    as: 'to_user'
                },     
            },
            { $unwind: '$to_user' },
            {$lookup:
                {
                    from: 'deeds',
                    localField: 'deed',
                    foreignField: '_id',
                    as: 'deed'
                },     
            },
            { $unwind: '$deed' },
            ]);
        return feedbacks;
    } catch(err) {
        return undefined;
    }
}

/**
 * Gets all feedback for user
 * 
 * @param {Object} user - the user
 * @returns {Feedback[] | undefined } feedback that exist or undefined if not possible
 */
 async function findRecievedFeedback(user) {
    try {
        const feedbacks = await Feedback.aggregate([
            { $match: { to_user: mongoose.Types.ObjectId(user._id) } },
            {$lookup:
                {
                    from: 'users',
                    localField: 'from_user',
                    foreignField: '_id',
                    as: 'from_user'
                },     
            },
            { $unwind: '$from_user' },
            {$lookup:
                {
                    from: 'users',
                    localField: 'to_user',
                    foreignField: '_id',
                    as: 'to_user'
                },     
            },
            { $unwind: '$to_user' },
            {$lookup:
                {
                    from: 'deeds',
                    localField: 'deed',
                    foreignField: '_id',
                    as: 'deed'
                },     
            },
            { $unwind: '$deed' },
            ]);
        return feedbacks
    } catch(err) {
        return undefined;
    }
}

module.exports = Object.freeze({
    addOne,
    findGivenFeedback,
    findRecievedFeedback
});