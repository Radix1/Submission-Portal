const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/db');

const app = express();
const users = require('./routes/users');

const port = 3000;

//connect to database
mongoose.connect(config.database);

mongoose.connection.on('connected', async ()=> {
    console.log(`Connected on ${config.database}`);
})

mongoose.connection.on('error', async (err)=> {
    console.log(`Database error ${err}`);
})
app.use(cors());

app.use(bodyParser.json());

app.use('/users', users);

app.get('/', (req, res) => {
    res.send(`Working...`);
})

//passport middleware 
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})