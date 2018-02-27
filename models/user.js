const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

//User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = ((id, callback) => {
    User.findById(id, callback);
    });

module.exports.getUserByUsername = ((username, callback) => {
    const query = { username: username };
    User.findOne(query, callback);
});

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = ((userPassword, hash, callback) => {
    bcrypt.compare(userPassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
});