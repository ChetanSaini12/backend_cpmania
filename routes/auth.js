const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



router.post("/signup", async (req, res) => {
  console.log("Body" + req.body);
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      username,
      leetcodeURL = "",
      atcoderURL = "",
      codeforcesURL = "",
      codechefURL = "",
    } = req.body;

    if (!name || !email || !password || !confirm_password || !username) {
      return res.status(422).send({ message: "Please fill all the fields", success: false });
    }

    if (password !== confirm_password) {
      return res
        .status(422)
        .send({ message: "Password and Confirm Password are not same" , success: false });
    }

    if (!email.includes("@") || !email.includes(".", email.indexOf("@"))) {
      return res.status(422).send({ message: "Invalid Email", success: false });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .send({ message: "Password length must be atleast 6 characters", success: false });
    }

    if (
      username.includes(" ") ||
      username.includes("\t") ||
      username.includes("\n") ||
      username.includes("@")
    ) {
      return res.status(422).send({ message: "Invalid Username", success: false });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SECRET_PASSWORD_SALT_NUMBER)
    );
    const profile_pic = `https://ui-avatars.com/api/?name=${name}&size=128&background=random`;
    const user = new userSchema({
      name,
      email,
      profile_pic,
      password: hashedPassword,
      username,
      leetcodeURL,
      atcoderURL,
      codeforcesURL,
      codechefURL,
    });

    const savedUser = await user.save();

    // const token = jwt.sign({ _id: savedUser._id });

    // res.status(201).send({ message: "Successfully Signed Up", token: token });
    res.status(201).send({ message: "Successfully Signed Up" , success: true });
  } catch (err) {
    console.log("Error: " + err); 
    let error = "Something went wrong";
    if (err.code === 11000) {
      key = Object.keys(err.keyValue)[0];
      error = `${key} already exists`;
    }

    res.status(400).send({message: error, success: false});
  }
});

router.post("/login", async (req, res) => {

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(422).send({ message: "Please fill all the fields", success: false });
    }

    const user = await userSchema.findOne({ username: username });

    if (!user) {
      return res.status(400).send({ message: "Invalid Username", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid Password", success: false });
    }

    // const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    // res.status(200).send({ message: "Successfully Signed In", token: token, success: true });
    res.status(200).send({ message: "Successfully Signed In", success: true });

  }
  catch (err) {
    console.log("Error: " + err);
    res.status(400).send({ message: "SignIn Failed", success: false });
  }

});


module.exports = router;
