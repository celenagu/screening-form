// questionModel.js
// This stores the list of questions for a given survey

const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum:['text', 'singleChoice1', 'singleChoice2', 'multipleChoice'],
    required: true,
  },
  answerChoices: [{type: String}],
  surveyId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Question", questionSchema);