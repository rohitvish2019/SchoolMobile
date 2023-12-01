const Student = require('../modals/admissionSchema');
const FeesHistory = require('../modals/feeHistory');
const Fee = require('../modals/FeeSchema');
const moment = require('moment');
const fs = require('fs');
const propertiesReader = require('properties-reader');


var json2xls = require('json2xls');
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
    if(req.user.role == 'Admin'){
        try{
            return res.render('reports_home',{error:"", role:req.user.role});
        }catch(err){
            return res.redirect('back');
        }
    }else{
        return res.render('Error_403')
    }
    
}


module.exports.getClassList = async function(req, res){
    
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            let studentsList = await Student.find({Class:req.query.Class, Session:req.query.Admission_year});
            console.log(studentsList);
            if(studentsList.length > 0){
                return res.status(200).json({
                    message:'Success',
                    data: studentsList
                })
            }
            else if(studentsList.length <= 0){
                return res.status(412).json({
                    message: 'Empty result received from server'
                })
            }
        }else{
            return res.status(403).json({
                message:'Unautorized'
            })
        }
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
    
}

module.exports.getReports = async function(req, res){
    if(req.user.role == 'Admin'){
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        classList = null;
        try{
            if(req.query.purpose === 'feesReport'){
                response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'admittedStudents'){
                response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'usersCollection'){
                response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
            }else if(req.query.purpose === 'currentActiveStudents'){
                response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'feesDuesTotal'){
                response = await getFeesDuesTotal(req.user)
            }else if(req.query.purpose === 'feesDuesClass'){
                response = await getFeesDuesByClass(req.user,req.query.Class);
            }else if( req.query.purpose === 'incompleteResult'){
                classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');;
                response = await getIncompleteResultsByClass(req.user);
            }
            if(response == 500){
                return res.status(500).json({
                    message:'Unable to fetch report'
                })
            }else{
                return res.status(200).json({
                    classList,
                    response,
                    purpose:req.query.purpose
                })
            }
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Internal Server Error2'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

async function getAdmittedStudentsReport(start_date, end_date, activeUser){
    try{

        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        console.log("Start date is : "+startDate);
        let studentsList = await Student.find({SchoolCode:activeUser.SchoolCode,AdmissionDate:{$gte:startDate,$lte:endDate}}).lean();
        return studentsList
    }catch(err){
        console.log("getting error")
        console.log(err);
        return 500
    }
}


async function getFeesReport(start_date, end_date, activeUser){
    try{
        console.log(start_date);
        let startDate = new Date(start_date).toISOString();
        console.log(startDate);
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        console.log("Start Date : "+startDate+' end date : '+endDate)
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode,Payment_Date:{$gt:startDate, $lte:endDate}}).select('-_id -__v').lean();
        
        return feesHistory;
    }catch(err){
        console.log(err);
        return 500
    }
}


async function getCurrentActiveStudentsList(start_date, end_date, activeUser){
    try{
        let students = await Student.find({SchoolCode:activeUser.SchoolCode,isThisCurrentRecord:true}).lean();
        return students
    }catch(err){
        return 500
    }
    
}
async function getFeesDuesTotal(user){
    try{
        let records = await Fee.find({SchoolCode:user.SchoolCode,Remaining:{$gt:0}}).lean();
        return records
    }catch(err){
        logger.error(err.toString());
        return null
    }
}

//Functions not live yet

async function getFeesReportByUser(start_date, end_date, activeUser, userToSearch){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode, PaidTo:req.body.email,Payment_Date:{$gt:startDate, $lte:endDate}}).lean();
        return feesHistory
        
    }catch(err){
        return 500
    }
}


async function getFeesDuesByClass(user, Class){
    try{
        let records = await Fee.find({Class:Class,SchoolCode:user.SchoolCode,Remaining:{$gt:0}}).lean();
        return records
    }catch(err){
        logger.error(err.toString());
        return null
    }
}

async function getIncompleteResultsByClass(user){
    try{
        let records = await Student.find({TotalGrade:null, SchoolCode:user.SchoolCode},'Class').lean();
        return records
    }catch(err){
        logger.error(err.toString());
        return null
    }
}


module.exports.getCSV = async function(req, res){
    if(req.user.role == 'Admin'){
        try{
            let response = [];
            if(req.query.purpose === 'feesReport'){
                response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'admittedStudents'){
                response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'usersCollection'){
                response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
            }else if(req.query.purpose === 'currentActiveStudents'){
                response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'feesDuesTotal'){
                response = await getFeesDuesTotal(req.user)
            }else if(req.query.purpose === 'feesDuesClass'){
                response = await getFeesDuesByClass(req.user,req.query.Class);
            }else if( req.query.purpose === 'incompleteResult'){
                classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');;
                response = await getIncompleteResultsByClass(req.user);
            }
            let filename = saveCSV(response,req.query.start_date+"to"+req.query.end_date+'_'+req.query.purpose);
            if(filename == 500){
                return res.status(500).json({
                    message:'Unable to create Excel'
                })
            }
            return res.status(200).json({
                message:'Downloading report',
                filename
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:'Internal Server Error'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

function saveCSV(reportArray, filename){
    try{
        json = reportArray
        let xls = json2xls(json);
        fs.writeFileSync('../School/assets/reports/'+filename+'.xlsx', xls, 'binary');
        return filename
    }catch(err){
        return 500;
    }
}

module.exports.bulkReportsHome = function(req, res){
    if(req.user.role == 'Admin'){
        try{
            return res.render('reports',{role:req.user.role});
        }catch(err){
            logger.error(err.toString())
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')
    }
    
}



