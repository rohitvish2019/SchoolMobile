const Result = require('../modals/Result');
const Student = require('../modals/admissionSchema')
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


module.exports.getResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result =await Result.findOne({Class:req.query.Class, AdmissionNo: req.query.AdmissionNo, Term:req.query.Term});
            let student = await Student.findOne({AdmissionNo:result.AdmissionNo, Class:result.Class});
            console.log(req.query);
            if(result){
                return res.status(200).json({
                    message: "Result fetched",
                    data: {result, student}
                })
            }else{
                return res.status(404).json({
                    message:"No results found"
                })
            }
        }catch(err){
            return res.status(500).json({
                message:"Internal Server Error"
            })
        }
    }else{
        return res.status(403).json({
            message:'Unautorized'
        })
    }
    
}

/*
module.exports.addUpdateResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result = Result.findOne({AdmissionNo: req.body.AdmissionNo, Class:req.body.Class, Term:req.body.Term});
            if(result){
                console.log('deleting old record')
                await result.deleteOne();
            }
            await Result.create(req.body, function(){
                console.log('creating new record')
            });
            return res.redirect('back');
        }catch(err){
            return res.redirect('back');
        }
    }else{
        return res.render('Error_403');
    } 
}
*/


async function updateFinalGrade(AdmissionNo, Class, Term, SchoolCode){
    let properties = propertiesReader('../School/config/properties/'+SchoolCode+'.properties');
    try{
        let subjects = properties.get(SchoolCode+'.SUBJECTS_'+Class);
        let resultRecord = await Result.findOne({AdmissionNo:AdmissionNo,Class:Class,Term:Term, SchoolCode:SchoolCode}, subjects.toString().replaceAll(',',' '));
        let subjectList = subjects.split(',');
        let marksObtained = 0;
        let marksTotal =0;
        for(let i=0;i<subjectList.length;i++){
            marksObtained= marksObtained + resultRecord[subjectList[i]];
        }   
        marksTotal = +properties.get(SchoolCode+'.Final_TOTAL') * subjectList.length;
        let FinalGrade = calculateGrade(marksObtained*100/marksTotal);
        await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class,SchoolCode:SchoolCode},{TotalGrade:FinalGrade});
        return true;
    }catch(err){
        logger.error(err);
        return false;
    }
    
}
module.exports.updateResult = async  function(req, res){
    try{
        let resultRecord = await Result.findOne({Class:req.body.Class, AdmissionNo:req.body.AdmissionNo,Term:req.body.Term});
        let newRecord = await Result.create(req.body.marks);
        await newRecord.updateOne({SchoolCode:req.user.SchoolCode, Class:req.body.Class, AdmissionNo:req.body.AdmissionNo,Term:req.body.Term});
        newRecord.save();
        resultRecord.deleteOne();
        if(req.body.Term ==='Final'){
            let gradeUpdated = updateFinalGrade(req.body.AdmissionNo, req.body.Class, req.body.Term, req.user.SchoolCode);
            if(gradeUpdated){
                console.log("Grade updated")
                return res.status(200).json({
                    message:'Result updated successfully'
                });
            }else{
                return res.status(200).json({
                    message:'Final grade update failed, session result updated'
                });
            }
        }else{
            return res.status(200).json({
                message:'Result updated successfully'
            });
        }
        
    }catch(err){
        logger.error(err.toString());
        return res.status(500).json({
            message:'Unable to update result'
        })
    }
}

module.exports.searchResult = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let student = await Student.findOne({AdmissionNo:req.params.id, Class:req.query.Class});
            console.log(student);
            return res.render('search_result', {student:student, role:req.user.role});
        }catch(err){
            console.log(err);
            return res.redirect('back')
        }
    }else{
          return res.render('Error_403')  
    }
    
}

function getPercentage(marks, total){
    return marks*100/total
}


function calculateGrade(value){
    if(value > 100){
        return "Invalid"
    }
    if(value <= -1){
        return 'NA'
    }else if( value <= 100 && value > 90){
        return 'A+'
    }else if(value <= 90 && value > 74){
        return 'A'
    }else if( value <= 75 && value > 59){
        return 'B'
    }else if(value <= 60 && value > 44){
        return 'C'
    }else if(value <= 45 && value > 33){
        return 'D'
    }else{
        return 'F'
    }
}
/*
async function updateFinalGrades(AdmissionNo, Class){
    let resultData = await Result.find({AdmissionNo:AdmissionNo, Class:Class});
    for(let i=0;i<resultData.length;i++){
        
    }
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{quarterlyGrade:"A"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{halfYearlyGrade:"B"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{finalGrade:"C"})
    await Student.findOneAndUpdate({AdmissionNo:AdmissionNo,Class:Class},{TotalGrade:"D"})
    console.log("printing result")
    console.log(resultData);
}
*/

module.exports.updateAllResults = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        try{
            let result_q = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Quarterly'});
            let result_h = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Half-Yearly'});
            let result_f = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, Term:'Final'});
            console.log(result_q);
    
            await result_q.updateOne({Hindi:+req.body.Hindi_q});
            await result_q.updateOne({English:+req.body.English_q});
            await result_q.updateOne({Math:+req.body.Math_q});
    
            await result_h.updateOne({Hindi:+req.body.Hindi_h});
            await result_h.updateOne({English:+req.body.English_h});
            await result_h.updateOne({Math:+req.body.Math_h});
    
            await result_f.updateOne({Hindi:+req.body.Hindi_f});
            await result_f.updateOne({English:+req.body.English_f});
            await result_f.updateOne({Math:+req.body.Math_f});
    
            if(req.query.Class === '6' || req.query.Class == '7' || req.query.Class == '8'){
                await result_q.updateOne({Science:+req.body.Science_q});
                await result_q.updateOne({Social_Science:+req.body.Social_Science_q});
                await result_q.updateOne({Sanskrit:+req.body.Sanskrit_q});
    
                await result_h.updateOne({Science:+req.body.Science_h});
                await result_h.updateOne({Social_Science:+req.body.Social_Science_h});
                await result_h.updateOne({Sanskrit:+req.body.Sanskrit_h});
    
                await result_f.updateOne({Science:+req.body.Science_f});
                await result_f.updateOne({Social_Science:+req.body.Social_Science_f});
                await result_f.updateOne({Sanskrit:+req.body.Sanskrit_f});
            }
            else{
                await result_q.updateOne({Enviornment:+req.body.Enviornment_q});
                await result_q.updateOne({Computer:+req.body.Computer_q});
                await result_q.updateOne({Moral:+req.body.Moral_q});
    
                await result_h.updateOne({Enviornment:+req.body.Enviornment_h});
                await result_h.updateOne({Computer:+req.body.Computer_h});
                await result_h.updateOne({Moral:+req.body.Moral_h});
    
                await result_f.updateOne({Enviornment:+req.body.Enviornment_f});
                await result_f.updateOne({Computer:+req.body.Computer_f});
                await result_f.updateOne({Moral:+req.body.Moral_f});
            }
            
            await result_q.save();
            //updateFinalGrades(req.params.AdmissionNo,req.query.Class);
            return res.redirect('back')
        }catch(err){
            console.log(err)
            return res.redirect('back')
            
        }
    }else{
         return res.render('Error_403')   
    }
    
}


module.exports.getSubjectsListWithMarks = async function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let classValue = req.query.classValue;
        let updatedClassValue = classValue;
        if(classValue == 'kg-1'){
            updatedClassValue = 'KG1'
        }else if(classValue == 'kg-2'){
            updatedClassValue = 'KG2'
        }
    
        let subjectsData = properties.get(req.user.SchoolCode+'.SUBJECTS_'+updatedClassValue);
        console.log(subjectsData.replaceAll(',',' '));
        let subjects = subjectsData.split(',');
        let obtainedMarks = await Result.findOne({Class:req.query.classValue, AdmissionNo:req.query.admissionNo, Term:req.query.Term},subjectsData.replaceAll(',',' '));
        let totalMarks = properties.get(req.user.SchoolCode+'.'+req.query.Term+'_TOTAL');
        console.log(obtainedMarks);
        console.log(subjects);
        console.log(totalMarks);
        return res.status(200).json({
            subjects,
            obtainedMarks,
            totalMarks
        })
    }catch(err){
        logger.error(err.toString())
        return res.status(500).json({
            message:'Unable to fetch subjects and marks'
        })
    }
}


module.exports.getTerms = function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{    
        let terms = properties.get(req.user.SchoolCode+'.EXAM_SESSIONS').split(',')
        return res.status(200).json({
            terms
        })
    }catch(err){
        logger.error(err.toString());
        return res.status(500).json({
            message:'Unable to fetch exam terms'
        })
    }
}



