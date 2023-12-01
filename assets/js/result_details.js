function calculateTotal(){
    console.log(document.getElementsByName('Moral_f').value);
}

function getTerms(){
    $.ajax({
        url:'/result/terms',
        type:'GET',
        success:function(data){
            let container = document.getElementById('selectTerm');
            container.innerHTML=
            `
            <option selected disabled>Select Term</option>
            `
            let terms = data.terms;
            for(let i=0;i<terms.length;i++){
                let item = document.createElement('option');
                item.innerText=terms[i]
                item.value = terms[i]
                container.appendChild(item)
            }
        },
        error:function(err){console.log(err.responseText)}
    })
}

document.getElementById('selectTerm').addEventListener('change', getResult)

function getResult(){
    getSubjects();
}

function getSubjects(){

    $.ajax({
        url:'/result/subjects',
        data:{
            classValue:document.getElementById('studentClass').innerText,
            admissionNo:document.getElementById('AdmissionNo').innerText,
            Term: document.getElementById('selectTerm').value
        },
        success:function(data){
            subjects = data.subjects;
            obtainedMarks = data.obtainedMarks
            console.log(data);
            totalMarks = data.totalMarks
            let container = document.getElementById('result-container');
            container.innerHTML=``;
            for(let i=0;i<subjects.length;i++){
                let item = document.createElement('tr');
                let grade = +obtainedMarks[subjects[i]] * 100/ +totalMarks
                item.innerHTML=
                `
                <td class='subjects' id='subject_${subjects[i]}'>${subjects[i]}</td>
                <td><input class='marks' id='marks_${subjects[i]}' type='text' value='${obtainedMarks[subjects[i]]}'></td>
                <td>${totalMarks}</td>
                <td>
                    ${calculateGrade(grade)}
                </td>
                `
                container.appendChild(item)
            }
        },
        error:function(err){console.log(err.responseText)}
    })
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

function updateResult(){
    let subjects = document.getElementsByClassName('subjects');
    let marks = document.getElementsByClassName('marks');
    let new_data = new Object()
    let subjects_list = new Array();
    for(let i=0;i<subjects.length;i++){
        let subject_name = subjects[i].id.slice(8);
        let marks_number = marks['marks_'+subject_name].value;
        subjects_list.push(subject_name)
        let item = new Object();
        new_data[subject_name]=marks_number
    }
    $.ajax({
        url:'/result/update',
        type:'POST',
        data:{
            subjects_list,
            Class:document.getElementById('studentClass').innerText,
            AdmissionNo:document.getElementById('AdmissionNo').innerText,
            Term: document.getElementById('selectTerm').value,
            marks:new_data,
        },
        success:function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            getResult();
        },
        error:function(err){console.log(err.responseText)}
    })

}

getTerms();
calculateTotal();