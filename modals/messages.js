
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const messages = new mongoose.Schema({
    Message : {
        type: String,
    },
    Heading:{
        type:String
    },
    Category :{
        type: String,
        enum:['Individual', 'Class', 'School']
    },
    Value:{
        type:String,
    },
    expiresAt:{
        type:String
    },
    SchoolCode:{
    
        type:String
    },
},
{
    timestamps:true
});

const Messages = mongoose.model('Message', messages);
module.exports = Messages;