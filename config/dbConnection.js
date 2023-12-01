const mongoose = require('mongoose');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('config/database.properties');
let url = properties.get('url');
mongoose.connect(url);

const db = mongoose.connection;
db.on('error', function(){
    console.log("Error received while connecting to DB");
});

db.once('open', function(){
    console.log("Successfully connected to db");
});

module.exports = db;