// responseModel.js
// Stores a user's responses each time they submit a survey

const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
   // references user that submitted the response
    userId:{   
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey",
        required: true
    },
    // array, stores indiv response objects
    responses: [{
        responseId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        // refs question being answer
        questionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true
        },
        response:{
            type: String
        },
        selectedChoices: [{
            option: Number,
            checked: Boolean,
            detail: String
        }]
    }],
    procedureList:{
        head: String,
        neck: String,
        spine: String,
        abPelvis: String,
        chest: String,
        armsLegs: String 
    },
    // Records when the response was submitted
    timestamp:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Reponse", responseSchema);