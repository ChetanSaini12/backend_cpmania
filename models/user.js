const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
        unique: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024 // 1024 is the maximum length of a hashed password
    },
    profile_pic: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    leetcodeURL: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    atcoderURL: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    codeforcesURL: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    codechefURL: {
        type: String,
        required: false,
        trim: true,
        minlength: 3,
        maxlength: 1024
    }

});

// userSchema.plugin("mongoose-beautiful-unique-validation");

const User = mongoose.model('User', userSchema);

module.exports = User;

