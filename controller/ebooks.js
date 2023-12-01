const propertiesReader = require('properties-reader');
const eBooks = require('../modals/ebooks');
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


module.exports.home = function(req, res){
  try{
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    let imgdir = properties.get(req.user.SchoolCode+'_IMAGES')
    return res.render('ebooks',{imgdir,role:req.user.role, user:{SchoolCode:req.user.SchoolCode}});
  }catch(err){
    logger.error(err.toString())
    return res.redirect('back')
  }
    
}

module.exports.getEbooks = async function(req, res){
    try{
        console.log("Getting ebooks")
        console.log(req.query)
        let books = await eBooks.find({Class:req.query.Class, Board:req.query.Board, Medium:req.query.Medium});
        console.log(books);
        return res.status(200).json({
            data:books,
        });
    }catch(err){
        console.log(err);
        logger.error(err.toString())
        return res.status(500).json({
            message:'error fetching books'
        })
    }
    
}