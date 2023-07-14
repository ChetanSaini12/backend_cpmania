const {codechefRating, codeforcesRating, atcoderRating, leetcodeRating} = require('../ApiCalls/ratingapi')
const express = require('express');
const ratingRouter = express.Router();

ratingRouter.get('/', (req, res) => {
    res.send('Hello World!');
}); 

ratingRouter.get('/code_chef/:username', codechefRating)
ratingRouter.get('/codeforces/:users',codeforcesRating)
ratingRouter.get('/at_coder/:username',atcoderRating)
ratingRouter.get('/leet_code/:username',leetcodeRating)

module.exports=ratingRouter