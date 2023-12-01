
const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const AttendanceSchema = new mongoose.Schema({
    Class:String,
    Day:Number,
    Month:Number,
    Year:Number,
    Presents:String,
    Absents:String,
    SchoolCode:{
        type:String,
        default:'NA'
    },
},
{
    timestamps:true
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;