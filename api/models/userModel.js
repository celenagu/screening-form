// userModel.js
// Stores users

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName: { 
        type: String, 
        required: true 
    },
    lName: { 
        type: String, 
        required: true 
    },
    dpt: { 
        type: String, 
        required: true 
    }, 
    // array of surveys a given user has taken
    surveysTaken: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey"
    }]
});


module.exports = mongoose.model("User", userSchema);




