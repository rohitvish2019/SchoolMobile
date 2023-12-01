//const Student = require('../modals/admissionSchema');
const AdmissionNo = require('../modals/admission_no');
//const FeeStructure = require('../modals/feeStructure');
//const FeeSchema = require('../modals/FeeSchema');
//const Result = require('../modals/Result');
const AdmissionNumber = require('../modals/admission_no');
//const RegisterdStudent = require('../modals/RegistrationSchema');
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




//Old code

module.exports.addmission =async function(request, response){
    try{
        if(req.user.role === 'Admin'){
            let last = await AdmissionNo.findOne({SchoolCode:request.user.SchoolCode});
            if(last){
                let year = +new Date().getFullYear();
                let past_year = year -1;
                let current_year = year;
                let next_year = year + 1;
                let adm = last.LastAdmission + 1
                return response.render('./addmission', {ThisAdmissionNumber:adm,past_year, current_year, next_year, role:req.user.role });
                
            }else{
                return response.render('startup',{role:req.user.role})
            }
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}

//To add new student in record with dependencies 
/*
module.exports.addStudent = async function(request, response){
    let student, lastAdmissionNumber, ADN, fee, newFee, result_q, result_h,result_f, fee_record;
    try{
        student = await Student.create(request.body);
        lastAdmissionNumber = await AdmissionNo.findOne({SchoolCode:request.user.SchoolCode});
        ADN = lastAdmissionNumber.LastAdmission;
        await student.updateOne({AdmissionNo:ADN+1,SchoolCode:request.user.SchoolCode});
        
        fee = await FeeStructure.findOne({SchoolCode:request.user.SchoolCode,Class:request.body.Class});

        fee_record = await FeeSchema.create({
            AdmissionNo:ADN+1,
            Class:request.body.Class,
            Total:fee.Fees,
            Remaining: fee.Fees,
            Paid:0,
            SchoolCode:request.user.SchoolCode
        });

        
        result_q = await Result.create({
            AdmissionNo: ADN+1,
            Class:request.body.Class,
            Term: 'Quarterly',
            SchoolCode:request.user.SchoolCode
        });

        result_h = await Result.create({
            AdmissionNo: ADN+1,
            Class:request.body.Class,
            Term: 'Half-Yearly',
            SchoolCode:request.user.SchoolCode
        });

        result_f = await Result.create({
            AdmissionNo: ADN+1,
            Class:request.body.Class,
            Term: 'Final',
            SchoolCode:request.user.SchoolCode
        });

        await lastAdmissionNumber.updateOne({LastAdmission:ADN+1});
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
    }
    return response.redirect('/admissions')
}

*/
// To updateOne the last admission number in case of first startup of application

module.exports.updateLastAdmission =async function(req, res){
    try{
        await AdmissionNumber.create({
            LastAdmission:req.body.LastAdmission,
            SchoolCode:req.user.SchoolCode
        });
        return res.redirect('/registration/new')
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}


// To render the preview before submitting the adission form
/*
module.exports.getPreview = function(req, res){
    console.log(req.body)
    return res.render('AdmissionPreview', {data:req.body, role:req.user.role})
}
*/
// To get the student profile details/n form download
/*
module.exports.getProfile = async function(req, res){
    let student = await Student.findOne({AdmissionNo:req.params.id,SchoolCode:request.user.SchoolCode});
    console.log(req.params.id);
    return res.render('StudentProfile', {data:student, role:req.user.role})
}
*/