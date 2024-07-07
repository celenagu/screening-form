const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require("jsonwebtoken");


mongoose.connect("mongodb+srv://celenagu3344:celena@cluster0.6cxfa0q.mongodb.net/", 
    {
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDb", err);
    });


app.listen(port, () => {
    console.log("Server running on port 8000");
});

const User = require("./models/userModel");
const Question = require("./models/questionModel");
const Response = require("./models/responseModel");
const Survey = require("./models/surveyModel");

// route for submitting the form 
app.post("/submit", async (req, res) => {
    const {fName, lName, dpt, surveyId, procedureList, userSig, techSig, tech,  ...answers} = req.body;
    // const {fName, lName, dpt} = req.body;

    try{ 
        let user = await User.findOne({ fName, lName, dpt });

        if (!user) {
            // If user does not exist, create a new user object
            user = new User({ fName, lName, dpt });
            // Save new user to database
            await user.save();
        }

        
        // Create and format responses for each question
        const formattedResponses = Object.entries(answers).map(([questionId, answer]) => {
            if (typeof answer === 'object' && !Array.isArray(answer)){
                return{
                    responseId: new mongoose.Types.ObjectId(),
                    questionId,
                    response: JSON.stringify(answer),
                    selectedChoices: []
                };
            } else if (Array.isArray(answer)) {
                return{
                    responseId: new mongoose.Types.ObjectId(),
                    questionId,
                    response: null,
                    selectedChoices: answer.map(choice => ({
                        option: choice.option,
                        checked: choice.checked,
                        detail:choice.text || null,
                    }))
                };
            } else {
                return{
                    responseId: new mongoose.Types.ObjectId(),
                    questionId,
                    response: answer,
                    selectedChoices: []
                };
            }
        });

        //Create new response document and save
        const newResponse = new Response({
            userId: user._id,
            surveyId,
            responses: formattedResponses,
            procedureList: procedureList,
            userSig,
            techSig,
            tech
        });

        await newResponse.save();
        res.status(200).json({ message: "Submitted successfully" });
    } catch(err) {
        console.log("Error submitting survey", err);
        res.status(500).json({ message: "Error submitting survey" });
    }

});

//endpoint for retrieving latest survey
app.get("/surveys/latest", async(req, res) => {
    try{
        const latestSurvey = await Survey.findOne().sort({creationTime: -1}).populate('questions');
        
        if (!latestSurvey){
            return res.status(404).json({message: 'No surveys found'});
        }
    
        res.json(latestSurvey);
    } catch(error) {
        console.log('Error fetching latest survey:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

//endpoint for retrieving responses
// app.get("/responses", async(req, res) => {
//     try{
//         const responses = await Response.find(); //fetch all responses
//         res.json(responses); //convert to JSOn object
//     } catch (err) {
//         console.log("Error fetching responses:", err);
//         res.status(500).json({message: "Failed to retrieve responses"});
//     }
// });

//endpoint for retrieving the usernames and dates for each response
app.get("/responses/users", async(req, res) => {
    try{
        //fetch responses and populate 'userId' field with 'User' details
        const submissions = await Response.find().populate({ 
            path: 'userId',
            select: 'fName lName dpt' //selects fields to include with user
        });

        const userValues = submissions.map(response => ({
            fName: response.userId.fName,
            lName: response.userId.lName,
            dpt: response.userId.dpt,
            timestamp: response.timestamp
        }))

        res.json(userValues); // convert to JSON object
    } catch (err) {
        console.error("Error fetching responses:", err);
        res.status(500).json({message: "Failed to retrieve responses"});
    }
})