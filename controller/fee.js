const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
const FeeStructure = require('../modals/feeStructure');
const FeeHistory = require('../modals/feeHistory');
const admissionNoSchema = require('../modals/admission_no')

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


function convertDateFormat(thisDate){
    try{
        let year = thisDate.toString().slice(0,4);
        let month= thisDate.toString().slice(5,7);
        let day = thisDate.toString().slice(8,10);
        console.log( day+"-"+month+"-"+year)
        return day+"-"+month+"-"+year;
    }catch(err){
        return '';    
    }
}
// To get the fee details of individual student
module.exports.getFeeDetails = async function(req, res){
    try{    
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            let student = await Student.findById(req.params.id);
            feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo,SchoolCode:req.user.SchoolCode});
            return res.render('feeSubmit', {feeData:feeData, student:student, role:req.user.role});
        }else if(req.user.role === 'Student'){
            let student = await Student.findOne({_id:req.params.id, Mob:req.user.email});
            feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo,SchoolCode:req.user.SchoolCode});
            return res.render('feeSubmit', {feeData:feeData, student:student, role:req.user.role});
        }
        else{
            return res.render('Error_403')
        }
    }catch(err){
        return res.redirect('back')
    }
}

//
module.exports.getFee =async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let fee = await Fee.find({AdmissionNo:req.query.AdmissionNo,SchoolCode:req.user.SchoolCode});
            if(fee){
                return res.status(200).json({
                    message:'Success',
                    data:fee
                })
            }else{
                return res.status(404).json({
                    message:'No data found'
                })
            }
        }catch(err){
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    }else{
        return res.status(403).json({
            message:'You are not autorized for this action'
        })
    }
    
    
    
}

module.exports.feeSubmission =async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class,SchoolCode:req.user.SchoolCode});
            let paidFee = fee.Paid;
            let remainingFee = fee.Remaining;
            if(paidFee == null){
                paidFee = 0
            }
    
            if(remainingFee == null){
                remainingFee = 0
            }
            if(remainingFee < req.body.Amount){
                return res.status(400).json({
                    message:'Amount limit exceeding'
                })
            }
            await fee.updateOne({Paid:fee.Paid + +req.body.Amount, Remaining: fee.Remaining - +req.body.Amount });
            let lastFeeReceiptNumber = await admissionNoSchema.findOne({SchoolCode:req.user.SchoolCode});
            await lastFeeReceiptNumber.updateOne({LastFeeReceiptNo:lastFeeReceiptNumber.LastFeeReceiptNo+1});
            lastFeeReceiptNumber.save();
            console.log(lastFeeReceiptNumber);
            let today = new Date().getDate() +'-'+ (new Date().getMonth() + 1)+ '-'+new Date().getFullYear();
            await FeeHistory.create({
                AdmissionNo:fee.AdmissionNo,
                Class: fee.Class,
                SchoolCode:req.user.SchoolCode,
                Amount: req.body.Amount,
                Payment_Date: today,
                Comment: req.body.Comment,
                type:'Fees',
                Receipt_No:lastFeeReceiptNumber.LastFeeReceiptNo,
                PaidTo:req.user.email
            });
            return res.status(200).json({
                message:'Fees record updated successfully'
            })
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Internal server error'
            })
        }
    }else{
        return res.status(403).json({
            message:"Your are not authorized to perform this action"
        })
    }
}

module.exports.cancelFees = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            let feeRecord = await FeeHistory.findById(req.params.id);
            await feeRecord.updateOne({isCancelled:true});
            await feeRecord.save();
    
            let oldFee = await Fee.findOne({AdmissionNo:feeRecord.AdmissionNo, Class:feeRecord.Class,SchoolCode:req.user.SchoolCode});
            await Fee.findOneAndUpdate({AdmissionNo:feeRecord.AdmissionNo, Class:feeRecord.Class,SchoolCode:req.user.SchoolCode},{Paid:oldFee.Paid - feeRecord.Amount, Remaining:oldFee.Remaining + feeRecord.Amount});
            
            return res.status(200).json({
                message:'Fees cancelled'
            });
        }catch(err){
            return res.status(500).json({
                message:'Unable to cancel, Please try again later'
            });
        }
    }else{
        return res.render('Error_403')
    }
}

module.exports.updateFeeForm = async function(req, res){
    try{
        let feesData = [];
        if(req.user.role === 'Admin'){
            try{
                feesData = await FeeStructure.find({SchoolCode:req.user.SchoolCode});
                console.log(feesData);
            }catch(err){
                console.log(err);
            }
            return res.render('updateFeeForm', {feesData, role:req.user.role});
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
    
   
}

module.exports.updateFee = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            let currentFee = await FeeStructure.findOne({Class:req.body.Class,SchoolCode:req.user.SchoolCode});
            if(currentFee){
                await currentFee.updateOne({Fees: req.body.Fees});
                currentFee.save();
            }
            else{
                await FeeStructure.create({
                    Class:req.body.Class,
                    Fees: req.body.Fees,
                    SchoolCode:req.user.SchoolCode
                });
            }   
            
            return res.redirect('back');
        }catch(err){
            console.log(err);
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.addConsession = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class,SchoolCode:req.user.SchoolCode});
            if(fee){
                console.log("Entered in method");
                let cnc = fee.Concession;
                console.log(cnc);
                if(fee.Remaining < req.body.Amount){
                    return res.status(400).json({
                        message:'Amount limit exceeding'
                    })
                }
                await fee.updateOne({Concession: fee.Concession + +req.body.Amount, Remaining: fee.Remaining - req.body.Amount});
                fee.save();
                let today = new Date().getDate() +'-'+ (new Date().getMonth() + 1)+ '-'+new Date().getFullYear();
                
                await FeeHistory.create({
                    AdmissionNo:fee.AdmissionNo,
                    Class: fee.Class,
                    Amount: req.body.Amount,
                    Payment_Date: today,
                    Comment: req.body.Comment,
                    type:'Concession',
                    SchoolCode:req.user.SchoolCode,
                    PaidTo: req.user.email
                });
            }
            return res.status(200).json({
                message:'Successfully added concession record'
            })
        }catch(err){
            console.log(err);
            logger.error(err.toString());
            return res.status(500).json({
                message:'Error adding concession :: Internal server error'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unautorized"
        })
    }
    
    
}


module.exports.getFeeHistory = async function(req, res){
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo,type:'Fees',isCancelled:false,SchoolCode:req.user.SchoolCode}).sort({Payment_Date:'descending'});
            return res.status(200).json({
                message:'History fetched successfully',
                data: feeList
            })
        }else if(req.user.role === 'Student'){
            let student = await Student.findOne({AdmissionNo:req.params.AdmissionNo, Mob:req.user.email,isThisCurrentRecord:true});
            if(student){
                let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo,type:'Fees',isCancelled:false,SchoolCode:req.user.SchoolCode}).sort({Payment_Date:'descending'});
                return res.status(200).json({
                    message:'History fetched successfully',
                    data: feeList
                })
            }else{
                return res.status(403).json({
                    message:"Unautorized"
                })
            }
            
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}


module.exports.getConcessionHistory = async function(req, res){
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo, type:'Concession',SchoolCode:req.user.SchoolCode}).sort({Payment_Date:'descending'});
            return res.status(200).json({
                message:'History fetched successfully',
                data: feeList
            })
        }else{
            return res.status(403).json({
                message:"Unautorized"
            })
        }
    }catch(err){
        logger.error(err.toString())
        return res.status(500).json({
            message:'Unable to fetch history'
        })
    }
    
}

module.exports.getFeeReceipt = async function(req, res){
    try{
        let feeReport = await FeeHistory.findById(req.params.id);
        let student = await Student.findOne({AdmissionNo:feeReport.AdmissionNo, Class:feeReport.Class, SchoolCode:req.user.SchoolCode})
        console.log(feeReport);
        return res.render('fee_receipt',{feeReport, student, role:req.user.role,SchoolCode:req.user.SchoolCode});
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
    
}

module.exports.deleteAnnualFee = async function(req, res){
    try{
        await FeeStructure.findOneAndDelete({Class:req.params.Class, SchoolCode:req.user.SchoolCode});
        return res.status(200).json({
            message:'Record deleted successfully'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Error deleting message, please try again later"
        })
    }
    
}