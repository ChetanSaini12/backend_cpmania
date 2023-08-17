const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const userSchema = require("../models/user");

router.get("/:username", async (req, res) => {
    const username = req.params.username;
    const user = await userSchema.findOne({ username: username });
    if (user) {
        const data = {
            username: user.username,
            name: user.name,
            email: user.email,
            profile_pic: user.profile_pic,
            leetcodeURL: user.leetcodeURL,
            atcoderURL: user.atcoderURL,
            codeforcesURL: user.codeforcesURL,
            codechefURL: user.codechefURL
        }
        res.status(200).send({ user: data, success: true });
    }
    else {
        res.status(404).send({ message: "User not found", success: false });
    }
});

module.exports = router;