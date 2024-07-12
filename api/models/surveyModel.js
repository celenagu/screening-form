// surveyModel.js
// This stores the survey version

const mongoose = require("mongoose");
const questionSchema = require("./questionModel");

const surveySchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
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
});

module.exports = mongoose.model("Survey", surveySchema);