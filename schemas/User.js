const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var RewardData = new Schema(
    {
        "reward": {
            type: Schema.Types.ObjectId, 
            ref: "Reward", 
            required : true
        },
        "redeemed": {
            type: Boolean,
            default: false
        },
        "redeem_date": {
            type: Date,
            default: () => Date.now()
        },
        "expiry_date": {
            type: Date,
            default: () => Date.now() + 7*24*60*60*1000
        }
    }
);

const UserSchema = new Schema(
    {
        "user_name" : {
            type: String,
            required: true,
        },
        "user_password" : {
            type: String,
            required: true,
        },
        "user_phoneNumber" : { 
            type: Number,
            required: true,
        },
        "user_email" : {
            type: String, 
            required: false,
        },
        "user_kudos" : {
            type: Number,
            required: true,
        },
        "feedback_recieved": [
            {
                type: Schema.Types.ObjectId, 
                ref: "Feedback", 
                required : true
            }
        ],
        "feedback_given": [
            {
                type: Schema.Types.ObjectId, 
                ref: "Feedback", 
                required : true
            }
        ],
        "user_rewards": [
            RewardData
        ]
    }
);

module.exports = mongoose.model("User", UserSchema);