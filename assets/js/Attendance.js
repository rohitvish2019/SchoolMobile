function getStudentsList(){
    console.log('calling');
    let Class = document.getElementById('ClassForSearch').value;
    let DateVal  = document.getElementById('dateToUpdate').value;
    let day = new Date(DateVal).getDate();
    let month = new Date(DateVal).getMonth()+1;
    let year = new Date(DateVal).getFullYear();
    console.log(DateVal);
    if(Class == '' || DateVal==''|| day==NaN|| month ==''|| year==''){
        new Noty({
            theme: 'relax',
            text: "Please fill all feilds",
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url:'/Attendance/students/get',
        type:'GET',
        data:{
            Class,
            day,
            month,
            year
        },
        success: function(data){
            setTimeout( () =>{
                showStudentsList(data.record, data.students, data.status)
                
            }, 0)
        },
        error: function(err){showNoRecord(err)}
    })
}


function showStudentsList(record, students, status){
    document.getElementById('status').innerText= status
    let container = document.getElementById('students-list');
    container.innerHTML=``;
    if(record == '' || record == null){
        for(let i=0;i<students.length;i++){
            let item = document.createElement('tr');
            item.innerHTML=
        `
            <td>${students[i].FirstName} ${students[i].LastName}</td>
            <td>${students[i].FathersName}</td>
            <td>
            <button class="na" id="${students[i].AdmissionNo}" onclick="changeStatus(${students[i].AdmissionNo})">NA</button>
            </td>
        `
        container.appendChild(item)
        }
        return
    }

    
    for(let i=0;i<students.length;i++){
        let item = document.createElement('tr');
        if(record.Presents.match(students[i].AdmissionNo)){
            item.innerHTML=
            `
                <td>${students[i].FirstName} ${students[i].LastName}</td>
                <td>${students[i].FathersName}</td>
                <td>
                <button class="present" id="${students[i].AdmissionNo}" onclick="changeStatus(${students[i].AdmissionNo})">P</button>
                </td>
            `
            container.appendChild(item) 
        }else if(record.Absents.match(students[i].AdmissionNo)){
            item.innerHTML=
            `
                <td>${students[i].FirstName} ${students[i].LastName}</td>
                <td>${students[i].FathersName}</td>
                <td>
                <button class="absent" id="${students[i].AdmissionNo}" onclick="changeStatus(${students[i].AdmissionNo})">A</button>
                </td>
            `
            container.appendChild(item) 
        }
        else{
            item.innerHTML=
        `
            <td>${students[i].FirstName} ${students[i].LastName}</td>
            <td>${students[i].FathersName}</td>
            <td>
            <button class="na" id="${students[i].AdmissionNo}" onclick="changeStatus(${students[i].AdmissionNo})">NA</button>
            </td>
        `
        container.appendChild(item)
        }
        

    }
}


function changeStatus(id){
    console.log(id);
    let item = document.getElementById(id)
    let status = item.classList[0];
    console.log(status);
    if(status == 'present'){
        document.getElementById(id).classList.add('absent');
        document.getElementById(id).classList.remove('present');
        item.innerText='A';
    }
    else {
        document.getElementById(id).classList.remove('na');
        document.getElementById(id).classList.remove('absent');
        document.getElementById(id).classList.add('present');
        
        item.innerText='P'
    }
}

function updateAttendance(){
    let studentsListAbsent=[];
    let studentsListPresent =[];
    let Absents = document.getElementsByClassName('absent');
    let Presents = document.getElementsByClassName('present');
    console.log("presents are "+Presents.length);
    for(let i=0;i<Absents.length;i++){
        studentsListAbsent.push(Absents[i].id)
    }
    for(let j=0;j<Presents.length;j++){
        console.log(Presents[j].id);
        studentsListPresent.push(Presents[j].id);
        
    }
    let na = document.getElementsByClassName('na');
    let Class = document.getElementById('ClassForSearch').value;
    let DateVal  = document.getElementById('dateToUpdate').value;
    let day = new Date(DateVal).getDate();
    let month = new Date(DateVal).getMonth()+1;
    let year = new Date(DateVal).getFullYear();
    if(Class == '' || day==''|| month ==''|| year==''){
        new Noty({
            theme: 'relax',
            text: "Invalid Input",
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    if(na.length > 0){
        new Noty({
            theme: 'relax',
            text: "Please change status for all students",
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
        return
    }
    $.ajax({
        url:'/Attendance/students/update',
        type:'POST',
        data:{
            studentsListAbsent,
            studentsListPresent,
            Class,
            day,
            month,
            year
        },
        success:function(data){
            let container = document.getElementById('students-list');
            container.innerHTML=``;
            new Noty({
                theme: 'relax',
                text: "Updated records successfully",
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('status').innerText= 'Updated'
            return
        },
        error: function(data){
            new Noty({
                theme: 'relax',
                text: "Unable to update",
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
            document.getElementById('status').innerText= 'Not Updated'
            return
        }
    })               
    
}
//document.getElementById('ClassForSearch').addEventListener('change', getStudentsList);
document.getElementById('updateAttendanceButton').addEventListener('click', updateAttendance);

