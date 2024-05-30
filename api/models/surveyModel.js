// surveyModel.js
// This stores the survey version

const mongoose = require("mongoose");
const questionSchema = require("./questionModel");

const surveySchema = mongoose.Schema({
  questions: [questionSchema],
  title: {
    type: String,
  },
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
  },
  surveyId: { type: mongoose.Schema.Types.ObjectId },
});

module.exports = mongoose.model("Survey", surveySchema);