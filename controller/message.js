const Messages = require('../modals/messages');
const Students = require('../modals/admissionSchema');
const winston = require("winston");
const dateToday = new Date().getDate().toString()+'-'+ new Date().getMonth().toString() + '-'+ new Date().getFullYear().toString();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error_"+dateToday+'.log', level: "warn" }),
    new winston.transports.File({ filename: "logs/app_"+dateToday+".log" }),
  ],
});


module.exports.newMessage = function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            return res.render('message', {role:req.user.role});
        }catch(err){
            logger.error(err.toString())
            return res.redirect('back');
        }
    }else{
        return res.render('Error_403')
    }
}

module.exports.addMessageSchool = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            await Messages.create({
                Heading: req.body.Heading,
                Message: req.body.Message,
                SchoolCode: req.user.SchoolCode,
                Category:req.body.Category,
                Value:req.body.Value,
            });
            return res.status(200).json({
                message:'Message sent'
            })    
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:'Unable to send message'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}


module.exports.setNotificationsToClass = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            await Messages.create({
                Heading: req.body.Heading,
                Message: req.body.Message,
                SchoolCode: req.user.SchoolCode,
                Category:'Class',
                Value:req.params.Class,
            })
            return res.status(200).json({
                message:'Notification sent'
            })
        }catch(err){
            return res.status(500).json({
                message:'Unable to create notification'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}


module.exports.deleteMessage = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let message = await Messages.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                message:'Message deleted successfully',
                id:message._id
            })
        }catch(err){
            return res.status(500).json({
                message:'Unable to delete'
            })
        }
    }else{
        return res.render('Error_403')
    }
}

module.exports.getNotifications = async function(req, res){
    try{
        let students = await Students.find({Mob:req.user.email, isThisCurrentRecord:true});
        let messageToShow = [];
        let neededClasses = new Set();
        classesToGet=[]
        for(let i=0;i<students.length;i++){
            neededClasses.add(students[i].Class)
            console.log(students[i].Class)
            
        }
        console.log(neededClasses.forEach(function(data){
            console.log("data"+data);
            classesToGet.push(data);
        }));
        for(let i=0;i<classesToGet.length;i++){
            let messages = await Messages.find({Category:'Class',Value:classesToGet[i], SchoolCode: req.user.SchoolCode});
            for(let i=0;i<messages.length;i++){
                console.log(messages[i].Message)
                messageToShow.push(messages[i].Message);
            }
        }
        
        return res.status(200).json({
            message:"Notifications fetched",
            data:messageToShow
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}

module.exports.deleteMessageSchool = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let message = await Messages.findByIdAndDelete(req.body.id);
            return res.status(200).json({
                message: 'Record deleted'
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:'Unable to delete'
            })
        }
    }else{
        return res.render('Error_403')
    }
}