
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const TeachersDetails = new mongoose.Schema({
    Name:{
        type:String
    },
    Education :{
        type: String,
    },
    Salary:{
        type : Number
    },
    Address:{
        type:String
    },
    Mobile:{
        type:String
    },
    Aadhar:{
        type:String
    },
    DOB:{
        type:String
    },
    DOJ:{
        type:String
    },
    AccountNo:{
        type:String
    },
    Samagra:{
        type:String
    },
    SchoolCode:{
        
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    Documents:[{
        type:String
    }],
    Subjects:[{
        type:String,
        default:'General'
    }]
},
{
    timestamps:true
});

const Teachers = mongoose.model('Teachers', TeachersDetails);
module.exports = Teachers;