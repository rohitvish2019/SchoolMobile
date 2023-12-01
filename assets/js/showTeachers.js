//const TeachersDetails = require("../../modals/TeachersDetails");
document.getElementById('pop-up-box').setAttribute('hidden','true')
document.addEventListener('click', runListener);

function runListener(event){
    console.log(event.target.id.slice(4,));
    itemId = event.target.id;
    itemFirstClass = event.target.classList[0];
    
    if(itemId === 'AddNewTeacher'){
        document.getElementById('pop-up-box').removeAttribute('hidden');
        document.getElementById('teachersDetails').setAttribute('hidden','true');
    }
    else if(itemId === 'cancelButton'){
        document.getElementById('pop-up-box').setAttribute('hidden','true');
        document.getElementById('teachersDetails').removeAttribute('hidden');
    }
    else if(itemFirstClass === 'editTeacher'){
        document.getElementById(itemId.slice(5)+'_name').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_name').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_education').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_education').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_salary').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_salary').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_address').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_address').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_aadhar').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_aadhar').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_mobile').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_mobile').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_dob').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_dob').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_samagra').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_samagra').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_doj').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_doj').style.border='1px solid black'

        document.getElementById(itemId.slice(5)+'_account').removeAttribute('readonly');
        document.getElementById(itemId.slice(5)+'_account').style.border='1px solid black'

        //document.getElementById(itemId.slice(5)+'_subjects').removeAttribute('readonly');
        //document.getElementById(itemId.slice(5)+'_documents').removeAttribute('readonly');
        document.getElementById('update_'+itemId.slice(5)).removeAttribute('hidden');
        document.getElementById(itemId).setAttribute('hidden', 'true')
        document.getElementById('dropdownMenuButton1').setAttribute('hidden', 'true');
    }
    else if(itemId.match(/update.*/)){
        console.log('in update method')
        recordId = itemId.slice(7);
        console.log(recordId);
        $.ajax({
            type:'POST',
            url:'/teachers/update',
            data:{
                id:recordId,
                Name:document.getElementById(recordId+'_name')?document.getElementById(recordId+'_name').value:"",
                Address:document.getElementById(recordId+'_address')?document.getElementById(recordId+'_address').value:"",
                Salary:document.getElementById(recordId+'_salary')?document.getElementById(recordId+'_salary').value:"",
                Education:document.getElementById(recordId+'_education')?document.getElementById(recordId+'_education').value:"",
                Aadhar:document.getElementById(recordId+'_aadhar')?document.getElementById(recordId+'_aadhar').value:"",
                Samagra:document.getElementById(recordId+'_samagra')?document.getElementById(recordId+'_samagra').value:"",
                Mobile:document.getElementById(recordId+'_mobile')?document.getElementById(recordId+'_mobile').value:"",
                DOB:document.getElementById(recordId+'_dob')?document.getElementById(recordId+'_dob').value:"",
                AccountNo:document.getElementById(recordId+'_account')?document.getElementById(recordId+'_account').value:"",
                DOJ:document.getElementById(recordId+'_doj')?document.getElementById(recordId+'_doj').value:"",
               
            },
            success : function(data){
                console.log(data);
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1000
                }).show();
                setTimeout(function(){
                    window.location.href='/teachers/home'
                },800)
            },
            error: function(err){console.error.bind(err)}
        })
    }
    else if(itemId.match(/delete.*/)){
        removeTeacher(itemId.slice(7))
    }
}

let countInactives = 0;

function getInActiveTeachers(){
    
    console.log(document.getElementById('inactivateToggeler').checked)
    if(document.getElementById('inactivateToggeler').checked === true){
        $.ajax({
            url:'/teachers/inActives',
            type:'GET',
            success: function(data){
                showInactivesOnUI(data.inActives)
                console.log('data count is' + data.inActives.length)
                countInactives = data.inActives.length
            },
            error:function(err){
                
                console.log(err.responseText);
            }   
        })
    }else{
        console.log('count is ' +countInactives)
        for(let i=0;i<countInactives;i++){
            document.getElementById('table-body').deleteRow(-1)
        }
        
        return
    }
    
}

function showInactivesOnUI(teachers){
    console.log(teachers)
    let tablebody = document.getElementById('table-body')
    for(let i=0;i<teachers.length;i++){
        let element = document.createElement('tr');
        element.innerHTML=
        `
            <td><textarea readonly id="${teachers[i]._id}_name" rows="1">${teachers[i].Name}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_education" rows="1">${teachers[i].Education}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_salary" rows="1">${teachers[i].Salary}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_address" rows="1">${teachers[i].Address}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_mobile" name="" id="" rows="1">${teachers[i].Mobile}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_aadhar" name="" id="" rows="1">${teachers[i].Aadhar}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_dob" name="" id=""  rows="1">${teachers[i].DOB}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_samagra" name="" id=""  rows="1">${teachers[i].Samagra}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_doj" name="" id=""  rows="1">${teachers[i].DOJ}</textarea></td>
            <td><textarea readonly id="${teachers[i]._id}_account" name="" id="" rows="1">${teachers[i].AccountNo}</textarea></td>
            <td>
            
            <div class="dropdown">
                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Actions
                </button>
                <button hidden id="update_${teachers[i]._id}" class="btn btn-success">Update</button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="editTeacher dropdown-item" id="edit_${teachers[i]._id}">Edit</a></li>
                <li><a class="dropdown-item" href="">Generate payslip</a></li>
                <li><a class="dropdown-item" href="/teachers/activate/${teachers[i]._id}">Mark Active</a></li>
                <li><a class="dropdown-item" href="">Generate Exp letter</a></li>
                <li><a class="dropdown-item" id="delete_${teachers[i]._id}">Delete</a></li>
                </ul>
            </div>
            </td>
        
        `
        element.style.backgroundColor='#edb7bebf'
        tablebody.appendChild(element);
    }
}
function addTeacher(){
    let data = {
        Name:document.getElementById('teacherName').value,
        Education:document.getElementById('teacherEducation').value,
        Salary:document.getElementById('teacherSalary').value,
        Address:document.getElementById('teacherAddress').value,
        Mobile:document.getElementById('teacherMobile').value,
        Aadhar:document.getElementById('teacherAadhar').value,
        DOB:document.getElementById('teacherDob').value,
        Samagra:document.getElementById('teacherSssmId').value,
        DOJ:document.getElementById('teacherJoiningDate').value,
        AccountNo:document.getElementById('teacherAccountNo').value,
    }
    if(data.Name == '' || data.Education == '' || data.Salary == '' || data.Address == '' || data.Mobile == '' || data.Aadhar == ''
    || data.DOB == '' || data.Samagra == '' || data.DOJ == ''
    ){
        new Noty({
            theme: 'relax',
            text: 'Please fill mandatory feilds',
            type: 'error',
            layout: 'topRight',
            timeout: 1000
        }).show();
        return
    }
    $.ajax({
        url:'/teachers/addNew',
        data,
        type:'POST',
        success:function(data){
            window.location.href='/teachers/home',
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
        },
        error: function(err){
            console.log(err.responseText);
            new Noty({
                theme: 'relax',
                text: err.responseText,
                type: 'error',
                layout: 'topRight',
                timeout: 1000
            }).show();
        }
    })
}


function removeTeacher(recordId){
    $.ajax({
        type:'POST',
        url:'/teachers/remove',
        data:{
            id:recordId,
        },
        success : function(data){
            console.log(data);
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            setTimeout(function(){
                window.location.href='/teachers/home'
            },800)
        },
        error: function(err){console.error.bind(err)}
    })
}


