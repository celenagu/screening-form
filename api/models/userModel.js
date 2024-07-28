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
    title: {
        type:String,
        required: true
    },
    // array of surveys a given user has taken
    prevResponses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Response"
    }],
    timestamp:{
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("User", userSchema);




