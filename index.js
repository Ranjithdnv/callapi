const express = require("express");

const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(express.json());

var jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 10,
  type: "application/json",
});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: 1024 * 1024 * 10,
  type: "application/x-www-form-urlencoded",
});
// app.use(jsonParser);
// app.use(urlencodedParser);
// app.use(bodyParser.json());
const Call = require("./model/call");
const cors = require("cors");

app.use(cors("https://call-1lhl.onrender.com"));

mongoose
  .connect(
    "mongodb+srv://pavankumarmoka:3ccG3rpxQoWOGEJl@expresscluster.gfleory.mongodb.net/callstudent?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("success"));

// create----------------------------
// -----------------------------------
app.get("/students", async (req, res) => {
  console.log(req.body);
  const Students = await Call.find();
  try {
    res.status(200).json(Students);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
//retrieve------------------------------------
//----------------------------------------
app.post("/createstudent", async (req, res) => {
  console.log(req.body);
  const newPost = new Call(req.body);
  try {
    // console.log(req)
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
app.get("/", async (req, res) => {
  const newPost = new Call(req.body);
  try {
    // console.log(req)
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
//
app.delete("/", async (req, res) => {
  try {
    // console.log(req)
    await Call.deleteMany();
    res.status(200).json({ delete: "done" });
  } catch (err) {
    res.status(500).json(err);
  }
  // res.send(req.body)
});
//
app.listen(3004, () => {
  console.log("Server is running");
});
