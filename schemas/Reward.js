const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RewardSchema = new Schema(
    {
        "reward_name": {
            type: String,
            required: true,
        },
        "reward_source": {
            type: String,
            required: true
        },
        "internal_reward_source": {
            type: Boolean,
            required: true,
        },
        "reward_description": {
            type: String,
            required: true,
        },
        "kudos_value": {
            type: Number,
            required: true
        }
    }
);

module.exports = mongoose.model("Reward", RewardSchema);