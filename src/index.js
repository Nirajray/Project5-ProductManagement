// express is an server-side web framework for node.js which execute our code on the web
const express = require("express");
//body parser is a middleware, used to process data sent through an HTTP request body.
const bodyParser = require("body-parser");
const route = require("./routes/route.js"); //imported route
const mongoose = require("mongoose"); //ODM library for mongoDB
const app = express(); //Assign express in app variable
const multer= require("multer");
app.use( multer().any())
app.use(bodyParser.json()); //transforms the text-based JSON input into JS-accessible variables
//extended: true precises that the req.body object will contain values of any type instead of just strings.


mongoose.connect(
        "mongodb+srv://Nirajkumar:2gkjm25Aa8wh01yS@cluster0.kzih8.mongodb.net/Project-5?authSource=admin&replicaSet=atlas-11shqf-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("mongoDB Connected")) //return fullfiled promise
    .catch((err) => console.log(err)); //return rejected promise

app.use("/", route);

//port is two-way communication link between two programs running on the network
app.listen(process.env.PORT || 3000, function() {
    console.log("Express app running on port " + (process.env.PORT || 3000));
});