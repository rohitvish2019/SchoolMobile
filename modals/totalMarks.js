
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const totalMarks = new mongoose.Schema({
    Class:{
        type:String
    },
    Term :{
        type: Number,
        enum: ['Quarterly','Half-Yearly','Final']
    },
    Total:{
        type:Number,
    }
},
{
    timestamps:true
});

const FeeHistory = mongoose.model('FeesHistory', FeesHistory);
module.exports = FeeHistory;