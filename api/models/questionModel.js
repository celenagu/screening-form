// questionModel.js
// This stores the list of questions for a given survey

const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  subquestions: [{
    type: String,
    index: Number
  }],
  type: {
    type: String,
    // Should I change these to be integers? with a legend? would it be easier
    enum:['text', 'singleChoice0', 'singleChoice1', 'singleChoice2', 'multipleChoice', 
            'singleChoiceText1', 'singleChoiceText2'],
    required: true,
  },
  answerChoices: [{type: String}]
  // surveyId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Survey"
  // }

});

module.exports = mongoose.model("Question", questionSchema);