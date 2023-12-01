//This schema will store the history of fees for each student
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const moment = require('moment');
const FeesHistory = new mongoose.Schema({
    AdmissionNo : {
        type: String,
    },
    Class:{
        type:String
    },
    Amount :{
        type: Number
    },
    Payment_Date:{
        type:String,
        default: new Date().toISOString()
    },
    Comment:{
        type:String
    },
    Receipt_No:{
        type:Number
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    SchoolCode:{
    
        type:String
    },
    PaidTo:{
        type:String,
    },
    type:{
        type:String,
        enum:['Fees', 'Concession']
    }
},
{
    timestamps:true
});

const FeeHistory = mongoose.model('FeesHistory', FeesHistory);
module.exports = FeeHistory;