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
app.use(bodyParser.json());
const Call = require("./model/call");
const User = require("./model/user");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const cors = require("cors");

app.use(cors("https://call-1lhl.onrender.com"));
//-----------------------------------------------
mongoose
  .connect(
    "mongodb+srv://pavankumarmoka:3ccG3rpxQoWOGEJl@expresscluster.gfleory.mongodb.net/callstudent?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("success"));

//------------------

const protect = async (req, res, next) => {
  //  Getting token and check of it's there
  let token;

  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    res.status(200).json({ user: "null" });
    // const err = new AppError("You are noin taccess.", 401);
    // return next(err);
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, "secret");
  console.log(decoded);
  // 3) Check .lif user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    const err = new AppError("The user no longer exist.", 400);
    return next(err);
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently e log in again.", 401));
  }
  req.user = currentUser;
  next();
};

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
});
app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const user1 = await User.create(req.body);
    token = jwt.sign({ id: user1._id }, "secret", { expiresIn: 90000 });
    res.status(201).json({ status: "success", token, user1: { user1 } });
  } catch (err) {
    res.status(500).json(err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    // try {
    const { userId } = req.body;
    const password = req.body.password;
    // 1) Check if userId and password exist
    if (!userId || !password) {
      // return next(new AppError("Please provide userId and password!", 400));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ userId }).select("+password");
    // "userId":"jonfff@gh.io",
    // "password":"1qwvertzy",
    // const user = await User.findOne({ userId });
    // console.log(user)
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(200).json({ user: "null" });
      // return next(new AppError("Incorrect userId or password", 401));
    }
    //
    // 3) If everything ok, send token to client
    token = jwt.sign({ id: user._id }, "secret", { expiresIn: 900000 });
    req.headers.authorization = token;
    console.log(req.headers.authorization);
    res.status(201).json({ status: "success", token, user1: { user } });
  } catch (err) {
    res.status(500).json(err.message);
  }
});
//
app.put("/addclass/:_id", async (req, res) => {
  try {
    console.log(req.body);
    const post = await User.findByIdAndUpdate(
      req.params._id,
      { $push: { classes: req.body.classes } },
      { new: true }
    );
    res.status(200).json(post.classes);
  } catch (err) {
    res.status(500).json(err);
  }
});

//
app.listen(3004, () => {
  console.log("Server is running");
});
