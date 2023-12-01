//This schema will store the result of students
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const ResultSchema = new mongoose.Schema({
    Class : {
        type: String,
    },
    AdmissionNo :{
        type: String,
    },
    Term:{
        type:String,
    },
    Hindi:{
        type:Number,
        default: -1
    },
    English:{
        type:Number,
        default: -1
    },
    Math:{
        type:Number,
        default: -1
    },
    Social_Science:{
        type:Number,
        default: -1
    },
    Science:{
        type:Number,
        default: -1
    },
    Enviornment:{
        type:Number,
        default: -1
    },
    Sanskrit:{
        type:Number,
        default: -1
    },
    Computer:{
        type:Number,
        default: -1
    },
    Moral:{
        type:Number,
        default: -1
    },
    SchoolCode:{
        type:String
    },
    Drawing:{
        type:Number,
        default: -1
    },
    Java:{
        type:Number,
        default: -1
    },
    CPP:{
        type:Number,
        default:-1
    }
    
},
{
    timestamps:true
});

const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;