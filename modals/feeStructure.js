//This schema willl have the fees sturucture for every class
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const FeeStructure = new mongoose.Schema({
    Class : {
        type: String,
    },
    Fees :{
        type: Number
    },
    SchoolCode:{
        
        type:String
    },
},
{
    timestamps:true
});

const FeeStr = mongoose.model('FeeStructure', FeeStructure);
module.exports = FeeStr;