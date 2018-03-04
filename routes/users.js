const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/db');

//Register
router.post('/register', async (req,res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        year: req.body.year,
        college: req.body.college,
        contact: req.body.contact
    });
    try{
        let addUser = await User.addUser(newUser);
        res.json({success: true, msg: 'successfully Registered'});
    } catch(err) {
        return res.json({success: false, msg: 'Registration failed'})
    }
});

//authenticate
router.post('/authenticate', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800
                });
            res.json({
                success: true,
                token: 'JWT' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            return res.json({ success: false, msg: 'Wrong Password'});
            }
        })
    });
});

module.exports = router;
