const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    full_name:{
        type: String,
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required: true
    },
    SchoolCode:{
        type:String
    },
    isAdmin:{
        type: Boolean,
        default : false
    },
    role:{
        type:String
    },
    address:{
        type:String
    },
    mobile_number:{
        type:String
    }
},
{
    timestamps: true
});


let User = mongoose.model('User', userSchema);
module.exports = User;