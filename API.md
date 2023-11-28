## Routes

We use three main routes:

* /api/deeds: deal with retrieving, deleting, and updating deeds
* /api/user: deal with retrieving, deleting, and updating users
* /api/session: deal with signing in and out of users, retrieving username of current user.
* /api/feedback: deal with retrieving and posting feedback
* /api/rewards: deal with retrieving rewards

All other routes are invalid and yield an error message.

## DEEDS: 

* POST /api/deeds - Creates a new deed
    * @param {Date} date - the date associated to the deed, including time
    * @param {string} description - the description of the deed
    * @param {string} difficulty - the difficulty of the deed either LOW, MEDIUM, or HIGH
    * @param {int} estimatedHours - the estimated hours for the deed
    * @param {number} helperAmount - the amount of helpers that are needed 
    * @param {number} latitude - the latitude of the location
    * @param {number} longitude - the longitude of the location
    * @param {string} location - the location where the deed will take place in 
    * @param {string} title - the title of the deed
    * @throws {400}
        * when the date does not exist or is in the past in comparison to the current date
        * when the content does not exist or is empty
        * when the estimatedHours is nonexistent, or is less than or equal to 0 
        * when the helper amount is nonexistent or less than or equal to 0
        * when the title does not exist or is empty
    * @throws {401} - when the user is not logged in or doesn't have enough kudos to create the deed
    * @throws {403} - when deed could not be created despite having valid fields

* GET /api/deeds - Get all deeds
    * @param {string} requester - userID of the user 
    * @param {string} helper - username of the user 
    * @return {Deeds[]} list of all the deeds. If requester is specified, it will get
    * @throws {404}
        * when a `requester field is specified and user is not found with that ID
        * when the `helper` field is specified and a user with username `helper` could not be found
* DELETE /api/deeds - Deletes the deed with a specific id. 
    * @throws {401} - when the user is not logged in
    * @throws {403} - when the user is not the requester of the deed with id `id 
    * @throws {404} - when the deed to delete cannot be found

## USERS:

 * POST /api/user/ - Create a user
    * @param {string} username - username
    * @param {string} password - password
    * @param {string} email - user email address
    * @param {string} phoneNumber - user phone number
    * @return {201} - successfully created user
    * @throws {400} - if the user is already logged in
    * @throws {400} - if a field is missing
    * @throws {409} - if the username is already taken
 * GET /api/user/:userID? - Get a username with given userID
    * @throws {401} - if the user is not already logged in
 * PATCH /api/user - Patch a user with a new reward
     * @param {string} reward_name - name of reward
     * @throws {400} - when the reward name is invalid
     * @throws {401} - when the user is not logged in or doesn't have enough kudos to acquire the reward

## SESSION: 

 * GET /api/session/ - Get a username in the session
    * @throws {401} - if the user is not already logged in
 * POST /api/session - Sign in a user
    * @param {string} username - username
    * @param {string} password - password
    * @return {201} - successfully updated user
    * @throws {403} - if the user is already logged in
    * @throws {400} - if username or password is not filled
    * @throws {404} - if the username is not found
    * @throws {401} - if the password does not match
 * DELETE /api/session - Sign out a user.
    * @param {string} userID - userID in the session
    * @throws {401} - if the user is not logged in

## FEEDBACK:

 * POST /api/feedback - Create feedback
    * @param {string} username - username of user giving feedback
    * @param {string} review - feedback
    * @param {string} mood - satisfaction of the user's performance
    * @param {string} deed - deed associated with the user
    * @return {201} - successfully created feedback
    * @throws {400} - if a field is missing
    * @throws {401} - when the user giving feedback is not logged in
 * GET /api/feedback - Get all feedback
    * @param {string} giver username of user giving feedback
    * @param {string} receiver username of user recieving feedback
    * @return {Feedback[]} list of all feedback. If giver is specified, it will get the deeds that user with username `giver`
    *  has given. If reciever is specified, it will get the feedback the user with username `reciever` has recieved. 

## REWARDS:

 * GET /api/rewards - Get all rewards
    * @param {boolean} byUser - if true, return all rewards logged in user has acquired
    * @param {boolean} unredeemedOnly - if true, return only rewards logged in user has acquired and not yet redeemed
    * @param {boolean} unexpiredOnly - if true, return only rewards logged in user has acquired that have not yet expired
    * @throws {404} - if byUser is true and user is not logged in

