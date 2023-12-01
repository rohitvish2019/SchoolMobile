const AdmissionNo = require('../modals/admission_no');
const RegisteredStudent = require('../modals/RegistrationSchema');
const FeeStructure = require('../modals/feeStructure');
const Student = require('../modals/admissionSchema');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
const TCRecords = require('../modals/TC_Records');
const propertiesReader = require('properties-reader');

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

module.exports.registrationUI = async function(req, res){
    let Schoolproperties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let last = await AdmissionNo.findOne({SchoolCode:req.user.SchoolCode});
        let School_name = Schoolproperties.get(req.user.SchoolCode+'_name')
        let imgdir = Schoolproperties.get(req.user.SchoolCode+'_IMAGES')
        if(last){
            let year = +new Date().getFullYear();
            let past_year = year -1;
            let current_year = year;
            let next_year = year + 1;
            let RN = last.LastRegistration + 1
            return res.render('./Registration', {ThisRegNumber:RN,past_year, current_year, next_year,role:req.user.role,School_name,imgdir});
        }else{
            if(req.isAuthenticated && req.user.role === 'Admin'){
                return res.render('startup',{role:req.user.role})
            }else{
                return res.render('Error_403')
            }
            
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back');
    }
}

module.exports.getPreview = function(req, res){
    try{
        return res.render('RegistrationPreview', {data:req.body, role:req.user.role})
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
}

module.exports.register = async function(req, res){
    let student;
    try{
        student = await RegisteredStudent.create(req.body);
        lastRegistrationNumber = await AdmissionNo.findOne({SchoolCode:req.user.SchoolCode});
        RN = lastRegistrationNumber.LastRegistration;
        await student.updateOne({RegistrationNo:RN+1,SchoolCode:req.user.SchoolCode,RegisteredBy:req.user.email})
        await student.save();
        await lastRegistrationNumber.updateOne({LastRegistration:+RN+1});
        await lastRegistrationNumber.save();
        console.log(lastRegistrationNumber.LastRegistration);
    }catch(err){
        if(student){
            RegisteredStudent.deleteOne(student)
        }
        console.log(err);
    }
    return res.redirect('/registration/new');
}

module.exports.updateRegistration = async function(req, res){
    try{
        if(req.user.role === 'Teacher' || req.user.role === 'Admin'){
            let student = await RegisteredStudent.findOne({RegistrationNo:req.body.RegistrationNo,SchoolCode:req.user.SchoolCode});
            await student.deleteOne();
            student = await RegisteredStudent.create(req.body);
            await student.updateOne({SchoolCode:req.user.SchoolCode,RegisteredBy:req.user.email});
            return res.redirect('/registration/new')
        }
    }catch(err){
        console.log(err);
        return res.redirect('/user/home')
    }
    
}

module.exports.delete = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            await RegisteredStudent.findOneAndRemove({RegistrationNo:req.params.id, SchoolCode:req.user.SchoolCode});
            return res.status(200).json({
                message:'Student deleted successfully'
            })
        }catch(err){
            console.log(err);
            return res.status(404).json({
                message:'request failed'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unautorized"
        })
    }
    
    
}


function getDate(){
    try{
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;
        console.log(currentDate); 
        return currentDate
    }catch(err){
        logger.error(err.toString());
    }
    
}


module.exports.admit = async function(req, res){
    let Schoolproperties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    if(req.user.role === 'Admin'){
        let student,fee, studentData,result_q,result_h,result_f, fee_record;
        console.log(req.params);
        try{
            
            student = await RegisteredStudent.findOne({RegistrationNo:req.params.id, SchoolCode:req.user.SchoolCode});
            studentData = JSON.parse(JSON.stringify(student));
            delete studentData._id;
            fee = await FeeStructure.findOne({Class:studentData.Class,SchoolCode:req.user.SchoolCode});
            if(!fee){
                return res.status(503).json({
                    message:'No annual fee found'
                })
            }
            let findExistingRecord = await Student.findOne({AdmissionNo:studentData.AdmissionNo});
            if(findExistingRecord){
                return res.status(400).json({
                    message:'Duplicate admission No'
                })
            }
            let newStudent = await Student.create(studentData);
            let definedAdmissionNo = studentData.AdmissionNo;
            if(studentData.AdmissionNo){
                await newStudent.updateOne({SchoolCode:req.user.SchoolCode});
            }else{
                let adm = await AdmissionNo.findOne({SchoolCode:req.user.SchoolCode});
                let lastAdmissionNo = +adm.LastAdmission;
                await newStudent.updateOne({AdmissionNo: lastAdmissionNo+1, SchoolCode:req.user.SchoolCode});
                await adm.updateOne({LastAdmission:lastAdmissionNo+1});
                definedAdmissionNo = lastAdmissionNo+1;
                adm.save();
            }
            
            //fee = await FeeStructure.findOne({Class:studentData.Class,SchoolCode:req.user.SchoolCode});
            fee_record = await FeeSchema.create({
                AdmissionNo:definedAdmissionNo,
                Class:studentData.Class,
                Total:fee.Fees,
                Remaining: fee.Fees,
                Paid:0,
                SchoolCode:req.user.SchoolCode
            });
            if(studentData.OldFee){
                await FeeSchema.create({
                    AdmissionNo:definedAdmissionNo,
                    Class:'Old Fees',
                    Total:studentData.OldFee,
                    Remaining: studentData.OldFee,
                    Paid:0,
                    SchoolCode:req.user.SchoolCode
                });
            }
            let terms = Schoolproperties.get(req.user.SchoolCode+'.EXAM_SESSIONS').split(',');
            for(let i=0;i<terms.length;i++){
                await Result.create({
                    AdmissionNo: definedAdmissionNo,
                    Class:studentData.Class,
                    Term: terms[i],
                    SchoolCode:req.user.SchoolCode
                });
            }
            
            await RegisteredStudent.deleteOne(student);
            await TCRecords.create({
                AdmissionNo:definedAdmissionNo,
                AdmissionClass: studentData.Class,
                AdmissionDate: getDate(),
                SchoolCode:req.user.SchoolCode
            })
            return res.status(200).json({
                message:'Student admitted'
            });

        }catch(err){
            if(student){
                Student.deleteOne(student)
            }
            if(fee_record){
                FeeStructure.deleteOne(fee_record)
            }
            if(result_q){
                Result.deleteOne(result_q);
            }
            if(result_h){
                Result.deleteOne(result_h);
            }
            if(result_f){
                Result.deleteOne(result_f);
            }
            console.log(err);
            return res.status(503).json({
                message:'Unable to admit, please try again later'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unautorized"
        })
    }
    
}


module.exports.download = async function(req, res){
    try{
        if(req.user.role === 'Admin'){
            let data = await RegisteredStudent.findOne({RegistrationNo:req.params.id});
            return res.render('RegistrationForm', {data, role:req.user.role});
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }   
}