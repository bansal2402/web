const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true,
        min: 0
    },
    name: {
        type: String
    },
    phoneNo: {
        type: Number
    },
    loggedIn:{
        type: Boolean

    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;