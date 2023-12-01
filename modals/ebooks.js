const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const ebookSchema = new mongoose.Schema({
    Class:String,
    Medium:String,
    Board:String,
    Subject:String,
    Link:String,
    Title:String,
},
{
    timestamps:true
});

const Eboooks = mongoose.model('Ebook', ebookSchema);
module.exports = Eboooks;