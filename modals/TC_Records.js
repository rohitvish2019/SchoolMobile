
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const TCRecords = new mongoose.Schema({
    AdmissionNo:{
        type:String
    },
    AdmissionDate :{
        type: String,
        
    },
    RelievingDate:{
        type:String,
    },
    SchoolCode:{
        
        type:String
    },
    AdmissionClass:String,
    ReleivingClass:String
},
{
    timestamps:true
});

const TCRecord = mongoose.model('TCRecords', TCRecords);
module.exports = TCRecord;