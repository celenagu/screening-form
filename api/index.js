
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// console.log('\n\nDB_CONNECTION_STRING:', process.env.DB_CONNECTION_STRING);

const app = express();
const port =  3000;

const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

// const uri = process.env.MONGODB_URI || "mongodb+srv://celenagu3344:mYnI5kOGCt7eMJjN@cluster0.6cxfa0q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://localhost:27017/ScreeningApp";


mongoose.connect(uri, 
    {
        // useNewUrlParser: true, // Remove this line
        // useUnifiedTopology: true, // Remove this line
        // New options supported in the latest MongoDB driver (no need to explicitly set)
        // useFindAndModify: false,
        // useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDb", err);
    });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const User = require("./models/userModel");
const Question = require("./models/questionModel");
const Response = require("./models/responseModel");
const Survey = require("./models/surveyModel");

// route for submitting the form 
app.post("/submit", async (req, res) => {
    const {fName, lName, dpt, title, surveyId, procedureList, userSig, passFail, techSig, tech,  ...answers} = req.body;
    // const {fName, lName, dpt} = req.body;

    try{ 
        let user = await User.findOne({ fName, lName, dpt, title});
        const responseId = new mongoose.Types.ObjectId(); // Generate new responseId

        if (!user) {
            // If user does not exist, create a new user object
            user = new User({ fName, lName, dpt, title, prevResponses: [responseId]});
            // Save new user to database
            await user.save();
        } else {
            // If user exists, add new responseId to the responses array
            user.prevResponses.push(responseId);
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
            _id: responseId,
            userId: user._id,
            surveyId,
            responses: formattedResponses,
            procedureList: procedureList,
            userSig,
            passFail,
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
// app.get("/responses/", async(req, res) => {
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
            select: 'fName lName dpt title' //selects fields to include with user
        });

        // Handle the case where no responses exist
        if (!submissions || submissions.length === 0) {
            return res.status(200).json([]); // Return an empty array
        }  else {

            const userValues = submissions.map(response => ({
                fName: response.userId.fName,
                lName: response.userId.lName,
                dpt: response.userId.dpt,
                title: response.userId.title,
                timestamp: response.timestamp,
                responseId: response._id
            }))
    
            res.json(userValues); // convert to JSON object

        }
    } catch (err) {
        console.error("Error fetching responses:", err);
        res.status(500).json({message: "Failed to retrieve responses"});
    }
});

//endpoint for retrieving specific response
app.get("/responses/:responseId", async(req, res) => {
    const {responseId} = req.params;
    try{
        const response = await Response.findById(responseId)
            .populate({
                path: 'surveyId',
                select: 'text description'
            })
            .populate({
                path: 'userId',
                select: 'fName lName dpt title'
            })
            .populate({
                path: 'responses.questionId',
                select: "type question subquestions answerChoices"
            }) //fetch all responses

        if (response) {
            res.json(response);
        } else {
            res.status(404).json({message: "Response not found"});
        }
    } catch (err) {
        console.log("Error fetching responses:", err);
        res.status(500).json({message: "Failed to retrieve response"});
    }
});

// Delete specific response
app.delete('/responses/:responseId', async (req, res) => {
    const responseId = req.params.responseId; // Corrected to use responseId instead of id

    try {
        const response = await Response.findById(responseId);
        if (!response) {
            return res.status(404).json({error: 'Response not found'});
        }

        const userId = response.userId;

        //Delete response
        const deletedResponse = await Response.findByIdAndDelete(responseId);
        if (!deletedResponse) {
            return res.status(404).json({ error: 'Response not found' });
        }

        // find user to check how many previous responses
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        // Remove the responseId from the user's "responses" array
        user.prevResponses = user.prevResponses.filter(id => !id.equals(responseId));

        if (user.prevResponses.length === 0) {
            //If the user has no responses,delete the user

            const deletedUser = await User.findByIdAndDelete(userId);
            if (!deletedUser) {
                return res.status(404).json({error: 'User not found'});
            }
        } else {
            //Otherwise, save the updated user
            await user.save();
        }



        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});