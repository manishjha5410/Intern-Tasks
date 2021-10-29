const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.get('/', (req, res) => {
    res.json({
        "message": "Welcome to the weather api",
        "/all": "Get all current weather data based on latitude and longitude stored in a json",
        "/one/latitude&longitude": "Enter any latitude and longitude and get current weather info"
    });
});

require('./app/routes/note.routes.js')(app);
// listen for requests
app.listen(process.env.PORT, () => {
    console.log("Server is listening on port ",process.env.PORT);
});