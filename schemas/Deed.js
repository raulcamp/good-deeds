const mongoose = require('mongoose');
const DifficultyLevel = require('../models/difficultyLevels');
const Schema = mongoose.Schema; 

const DeedSchema = new Schema(
    {
        "deed_requester": {
            type: Schema.Types.ObjectId,
            ref : "User",
            required : true, 
        },
        "deed_date": { // also takes care of time
            type: String,
            required: true,
        },
        "deed_description": {
            type: String, 
            required: true,
        },
        "deed_difficulty": {
            type: String, 
            enum: DifficultyLevel,
            required: true, 
            default: DifficultyLevel.MEDIUM,
        },
        "deed_estimatedHours": {
            type: Number, 
            required: true,
        },
        "deed_helpersNeeded": {
            type: Number, 
            required: true, 
        },
        "deed_helpers": [
            {
                type: Schema.Types.ObjectId, 
                ref: "User", 
                required : true
            }
        ],
        "deed_kudos": {
            type: Number, 
            required: true, 
        },
        "deed_latitude": {
            type: Number,
            required: true,
        },
        "deed_longitude": {
            type: Number,
            required: true,
        },
        "deed_location": {
            type: String,
            required: true,
        },
        "deed_title": {
            type: String,
            required: true,
        },
        "deed_givenFeedback": [
            {
                type: Schema.Types.ObjectId, 
                ref: "User", 
                required : true
            }
        ],
        "deed_completed": {
            type: Boolean,
            required: true,
            default: false,
        }
    }
);

module.exports = mongoose.model("Deed", DeedSchema);