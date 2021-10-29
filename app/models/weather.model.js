const mongoose = require('mongoose');

const weather = mongoose.Schema({
    id: Number,
    latitude: Number,
    longitude: Number,
    main:String,
    description:String
},{
    timestamps: true
});

module.exports = mongoose.model('weather', weather);