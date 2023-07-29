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
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    if (password !== confirm_password) {
      return res
        .status(422)
        .json({ error: "Password and Confirm Password are not same" });
    }

    if (!email.includes("@") || !email.includes(".", email.indexOf("@"))) {
      return res.status(422).json({ error: "Invalid Email" });
    }

    if (password.length < 6) {
      return res
        .status(422)
        .json({ error: "Password length must be atleast 6 characters" });
    }

    if (
      username.includes(" ") ||
      username.includes("\t") ||
      username.includes("\n") ||
      username.includes("@")
    ) {
      return res.status(422).json({ error: "Invalid Username" });
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

    const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_KEY);

    res.status(201).send({ message: "Successfully Signed Up", token: token });
  } catch (err) {
    let error = "Something went wrong";
    if (err.code === 11000) {
      key = Object.keys(err.keyValue)[0];
      error = `${key} already exists`;
    }

    res.status(400).json({ error });
  }
});

module.exports = router;