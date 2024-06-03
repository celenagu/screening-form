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


app.post("/submit", (req, res) => {
    const {fName, lName, dpt} = req.body;

    // Create a new user object
    const newUser = new User ({ fName, lName, dpt});

    // save new user to database
    newUser
        .save()
        .then(() => {
            res.status(200).json({message: "Submitted successfully"});
        })
        .catch((err) => {
            console.log("Error submitting survey", err);
            res.status(500).json({message: "Error submitting survey"});
        });
});

