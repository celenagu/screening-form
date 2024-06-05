// surveyModel.js
// This stores the survey version

const mongoose = require("mongoose");
const questionSchema = require("./questionModel");

const surveySchema = mongoose.Schema({
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  description: {
    type: String,
  },
  creationTime: {
    type: Date,
    default: Date.now
  },
  currentVersion:{
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model("Survey", surveySchema);