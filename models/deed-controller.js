const Deed = require('../schemas/Deed');
// const User = require('../schemas/User');
const DifficultyLevel = require('../models/difficultyLevels');

/**
 * Creates a new Deed
 * 
 * @param {Deeds[]} - current deeds that exist
 * @param {Object} data - the data about the deed created by the user
 * @param {string} data.requester - the id of the requester of the deed
 * @param {Date} data.date - the date associated to the deed, including time
 * @param {string} data.description - the description of the deed
 * @param {string} data.difficulty - the difficulty of the deed either LOW, MEDIUM, or HIGH
 * @param {number} data.estimatedHours - the estimated amount of hours
 * @param {number} data.helpersNeeded - the amount of helpers that are needed
 * @param {number} data.latitude - the latitude of the location
 * @param {number} data.longitude - the longitude of the location
 * @param {string} data.location - the location where the deed will take place in 
 * @param {string} data.title - the title of the deed
 * @returns {Deed | undefined} newly created deed or undefined if cannot be added
 */
async function addOne(deeds, data) {
    try {
        const latLng = getLatLng(deeds, data.latitude, data.longitude);
        const deed = new Deed({
            deed_requester: data.requester,
            deed_date: data.date,
            deed_description: data.description,
            deed_difficulty: data.difficulty,
            deed_estimatedHours: data.estimatedHours, 
            deed_latitude:latLng[0], 
            deed_longitude: latLng[1],
            deed_helpersNeeded: data.helpersNeeded,
            deed_helpers: [],
            deed_kudos: calculateKudos(data.difficulty, data.estimatedHours),
            deed_location: data.location, 
            deed_title: data.title,
            deed_completed: false,
        });
        await deed.save();
        return deed;
    } catch (error) {
        return undefined;
    }
}

/**
 * Updates a deed with a specific `id`
 *
 * @param {Deeds[]} deeds - current deeds that exist
 * @param {Deed} deed - current deed to be updated
 * @param {Object} data - the new data about the deed updated by users
 * @returns {id | undefined} newly updated deed id or undefined if cannot be updated
 */
 async function updateOne(deeds, deed, data) {
    try {
        const latitude = data.latitude;
        const longitude = data.longitude; 
        const latLng =  latitude && longitude 
            ? getLatLng(deeds, data.latitude, data.longitude)
            : [deed.deed_latitude, deed.deed_longitude];
        await Deed.updateOne(
            { _id: deed._id },
            { $set:
               {
                 deed_date: data.date 
                    ?  data.date 
                    : deed.deed_date,
                 deed_description: data.description 
                    ? data.description 
                    : deed.deed_description,
                 deed_difficulty: data.difficulty 
                    ?  data.difficulty 
                    :  deed.deed_difficulty,
                 deed_estimatedHours: data.estimatedHours 
                    ? data.estimatedHours 
                    : deed.deed_estimatedHours, 
                 deed_helpersNeeded: data.helperAmount 
                    ?  data.helperAmount
                    :  deed.deed_helpersNeeded,
                 deed_kudos: data.kudos 
                    ? data.kudos 
                    : deed.deed_kudos,
                 deed_location: data.location 
                    ? data.location 
                    : deed.deed_location,
                 deed_latitude: latLng[0],
                 deed_longitude: latLng[1],
                 deed_title: data.title 
                    ? data.title 
                    : deed.deed_title,
                 deed_completed: data.completed
                    ? data.completed 
                    : deed.completed,
               }
            }
        );
        const updatedDeed = await findOne(deed._id);
        return updatedDeed;
    } catch(err) {
        return undefined;
    }
}

/**
 * Adds user as to deed's feedback
 * 
 * @param {Object} deed - deed to be updated
 * @param {Object} user - id of user to be added to deed's feedback
 * @returns {Deed | undefined} newly updated deed or undefined if cannot be updated
 */
 async function addUserToDeedFeedbacks(deed, user) {
    try {
        await Deed.findOneAndUpdate(
            { _id: deed._id },
            { $push:
               {
                deed_givenFeedback: user._id
               }
            }
        );
        const updatedDeed = await findOne(deed._id);
        return updatedDeed;
    } catch(err) {
        return undefined;
    }
}

/**
 * Adds user as a helper to deed
 * 
 * @param {String} deed - deed to be updated
 * @param {Object} user - id of user to be added as a helper
 * @returns {Deed | undefined} newly updated deed or undefined if cannot be updated
 */
 async function addDeedHelper(deed, user) {
    try {
        await Deed.findOneAndUpdate(
            { _id: deed._id },
            { $push:
               {
                 deed_helpers: user._id
               }
            }
        );
        const updatedDeed = await findOne(deed._id);
        return updatedDeed;
    } catch(err) {
        return undefined;
    }
}

/**
 * Removes user as a helper of deed
 * 
 * @param {String} deed - deed to be updated
 * @param {Object} user - id of user to be removed as a helper
 * @returns {Deed | undefined} newly updated deed or undefined if cannot be updated
 */
 async function removeDeedHelper(deed, user) {
    try {
        await Deed.findOneAndUpdate(
            { _id: deed._id },
            { $pull:
               {
                 deed_helpers: user._id
               }
            }
        );
        const updatedDeed = await findOne(deed._id);
        return updatedDeed;
    } catch(err) {
        return undefined;
    }
}

/**
 * Deletes a Deed with the specified ID `id`
 * 
 * @param {int} id - ID of the deed 
 * @returns {id | undefined} newly deleted deed id or undefined if cannot be deleted
 */
async function deleteOne(id) {
    try {
        await Deed.deleteOne({
            _id: id
        });
        return id;
    } catch (error) {
        return undefined;
    }
}

/**
 * Finds a deed with a specific `id`
 * @param {String} id  - ID of the deed
 * @returns the deed with id `id`
 */
async function findOne(id) {
    try {
        const deed = await Deed
            .findOne({
                _id: id,
            })
            .populate('deed_requester')
            .populate('deed_helpers');
        return deed;
    } catch(err) {
        return false;
    }
}

/**
 * Gets all the deeds that exist in the order from most recently created to last created
 * 
 * @returns {Deed[] | undefined} deeds that exist or undefined if not possible
 */
async function getAll() {
    try {
        const deeds = await Deed.aggregate([
        {$lookup:
            {
                from: 'users',
                localField: 'deed_requester',
                foreignField: '_id',
                as: 'deed_requester'
            },     
        },
        { $unwind: '$deed_requester' },
        {$lookup: 
            {
                from: 'users',
                localField: 'deed_helpers',
                foreignField: '_id',
                as: 'deed_helpers'
            }
        },
        ]);
        return deeds;
    } catch(err) {
      return undefined;
    }
}


/**
 * Gets the difficulty of the deed described in the string level
 * 
 * @param {string} level - the deed difficulty level 
 * @returns {DifficultyLevel} a level in the enum
 */ 
function getDeedDifficulty(level) {
    if (level.toLowerCase() === 'low') {
        return DifficultyLevel.LOW;
    } else if (level.toLowerCase() === 'medium') {
        return DifficultyLevel.MEDIUM;
    }
    return DifficultyLevel.HIGH;
}

/**
 * Gets the kudos of the 
 * 
 * @param {string} difficulty - the difficulty of the deed either LOW, MEDIUM, or HIGH
 * @param {number} estimatedHours - the estimated amount of hours
 * @returns {number} the calculated kudos based on a deed's difficulty and estimated hours
 */ 
function calculateKudos(difficulty, estimatedHours) {
    let kudos;
    if (difficulty === DifficultyLevel.LOW) {
        kudos = 10 * estimatedHours; 
    } else if (difficulty === DifficultyLevel.MEDIUM) {
        kudos = 20 * estimatedHours;
    } else if (difficulty === DifficultyLevel.HIGH) {
        kudos = 30 * estimatedHours;
    }
    return kudos;
}

/**
 * Gets all deeds requested by a specific user `id`
 * @param {String} id  - id of the user
 * @returns the deed that has user with id `id` as the requester
 */
async function findByRequester(id) {
    try {
        const deeds = await Deed.find({
            deed_requester: id,
        }); 
        return deeds;
    } catch(err) {
        return undefined;
    }
}

/**
 * Gets all deeds accepted by a specific user with username `username`
 * @param {String} id  - id of the user
 * @returns the deed that has user with id `id` as a helper
 */
 async function findByHelper(username) {
    try {
        const deeds = await Deed.find({
            deed_helpers: username,
        }); 
        return deeds;
    } catch(err) {
        return undefined;
    }
}

/**
 * Gets the latitude and longitude of the deed, adds offset if it conflicts with other deeds
 * 
 * @param {Deed[]} deeds current list of deeds
 * @param {number} currentLat - latitude of the deed a user wants to create
 * @param {number} currentLong - longitude of the deed a user wants to create
 * @returns {Number[]} - the 0th index of the list represents the new latitude, the 1st index of the 
 *                  list represents the new longitude 
 */ 
function getLatLng(deeds, currentLat, currentLong) {
    let step = 1;
    let offset = .0001; 
    let newLat = currentLat;
    let newLong = currentLong;
    // if conflicting deeds, change lat and/or long of current deed
    while(deeds.filter(deed => deed.deed_latitude === newLat && deed.deed_longitude === newLong).length !== 0) {
        // change only lat w/ positive offset
        if (step === 1) {
            newLong = currentLong;
            newLat = currentLat + offset;
            step ++;
        }
        // change only long w/ positive offset
        else if (step === 2) {
            newLat = currentLat; 
            newLong = currentLong + offset;
            step ++; 
        }
        // change lat and long w/ positive offset
        else if(step === 3) {
            newLat = currentLat + offset;
            newLong = currentLong + offset;
            step ++; 
        }
        // change only lat w/ negative offset
        else if (step === 4) {
            newLong = currentLong;
            newLat = currentLat - offset; 
            step ++;
        }
        // change only long w/ negative offset
        else if (step === 5){
            newLat = currentLat;
            newLong = currentLong - offset; 
            step ++;
        }
        // change lat + long w/ negative offset
        else if (step === 6) {
            newLat = currentLat - offset; 
            newLong = currentLong - offset; 
            offset = offset + .0001;
            step = 1;
        }
    }
    return [newLat, newLong];
}

module.exports = Object.freeze({
    addOne,
    calculateKudos,
    deleteOne,
    findOne,
    getAll,
    getDeedDifficulty,
    getLatLng,
    updateOne,
    addDeedHelper,
    removeDeedHelper,
    findByRequester,
    findByHelper,
    addUserToDeedFeedbacks
});