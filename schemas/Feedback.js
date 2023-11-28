const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const FeedbackSchema = new Schema(
    {
        "from_user" : { 
            type: Schema.Types.ObjectId,
            ref : "User",
            required : true, 
        },
        "to_user" : { 
            type: Schema.Types.ObjectId,
            ref : "User",
            required : true, 
        },
        "mood" : {
            type: String,
            required: true,
        },
        "review" : { 
            type: String,
            required: true,
        },
        "deed" : { 
            type: Schema.Types.ObjectId,
            ref : "Deed",
            required : true, 
        },
    }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);