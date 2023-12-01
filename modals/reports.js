//This will be used to add/get last admission number
const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const Reports = new mongoose.Schema({
    Name: {
        type:String
    },
    Password : {
        type:String
    },
    GeneratedBY:{
        type:String
    },
    SchoolCode:{
        type:String
    }
},
{
    timestamps:true
});


const reports = mongoose.model('Reports', Reports);
module.exports = Reports;