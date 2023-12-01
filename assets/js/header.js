document.getElementById('noti-button').addEventListener('click', notyPanelToggller);
document.getElementById('profile-toggle').addEventListener('click', profileToggeler);
document.getElementById('change-password').addEventListener('click', openChangePasswordForm);
document.getElementById('update-password-button').addEventListener('click', updatePassword)


function setLogo(){
    $.ajax({
        url:'get',
        type:'get'
    })
}
function notyPanelToggller(){
    console.log('in function')
    document.getElementById('profile-details').style.display='none'
    let container = document.getElementById('notifications')
    if(container.style.display === 'none'){
        container.style.display = 'block'
        getNotificationsfromserver();
    }else{
        container.style.display = 'none'
    }
}


function getNotificationsfromserver(){
    $.ajax({
        url:'/message/notifications',
        type:'GET',
        success: function(data){console.log(data)
            showNotifications(data.data)},
        error: function(err){console.log(err.responseText)}
    })
}


function showNotifications(data){
    let container = document.getElementById('notification-list');
    container.innerText='';
    for(let i=0;i<data.length;i++){
        let item = document.createElement('li');
        item.innerHTML=
        `
        <button class='noti-item'>${data[i]}</button>
        `
        //item.innerText=data[i];
        container.appendChild(item)
    }
}

document.getElementById('options').addEventListener('click', toggleHeader);

function toggleHeader(){
    console.log('Coreect')
    let header = document.getElementById('header-list-mobile');
    if(header && header.style.display === 'flex'){
        header.style.display = 'none'
    }else{
        header.style.display = 'flex'
    }
}

document.getElementById('searchBox').addEventListener('click', searchButton)
function searchButton(){
    document.addEventListener('click', closeSearchBox)
    let listContainer = document.getElementById('studnets-list');
    if(listContainer.style.display === 'block'){
        listContainer.style.display='none'


    }else{
        listContainer.style.display='block'

    }
}



function profileToggeler(){
    
    console.log('Caling...')
    document.getElementById('notifications').style.display='none'
    let element = document.getElementById('profile-details');
    if(element.style.display === 'block'){
        element.style.display = 'none'
    }else{
        element.style.display='block'
    }
    
}


function openChangePasswordForm(){
    
    document.getElementById('profile-data').style.display='none'
    document.getElementById('change-password-div').style.display='block'
}


function updatePassword(){
    let newPass1 = document.getElementById('newpass').value;
    let newPass2 = document.getElementById('confpass').value;
    if(newPass1 === '' || newPass2 === ''|| newPass1 != newPass2){
        new Noty({
            theme: 'relax',
            text: 'New password and confirm password does not match',
            type: 'error',
            layout: 'topRight',
            timeout: 1000
        }).show();
        return;
    }
    $.ajax({
        url:'/user/updatePassword',
        type:'POST',
        data:{
            oldPassword: document.getElementById('oldpass').value,
            newPassword : newPass1
        },
        success: function(data){
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            document.getElementById('profile-details').style.display='none'
        },
        error: function(err){
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


function cancelPasswordChange(){
    document.getElementById('profile-data').style.display='block'
    document.getElementById('change-password-div').style.display='none'
}

let studentsList=[]
function setStudentsListLocal(){
    $.ajax({
        url:'/student/getAll',
        type:'GET',
        success : function(data){
            console.log(data.students.length)
            for(let i=0;i<data.students.length;i++){
                studentsList.push(data.students[i])
                console.log(data.students[i]['AdmissionNo']+ " : "+data.students[i]['Class']+" "+data.students[i]['FathersName']+" "+data.students[i]['MothersName'])
                localStorage.setItem(data.students[i]['FirstName']+" "+data.students[i]['LastName'],data.students[i]['Class']+" "+data.students[i]['FathersName']+" "+data.students[i]['MothersName'])
            }
            
        },
        error: function(err){console.log(err.responseText)}
    })
}

setStudentsListLocal();
document.getElementById('searchBox').addEventListener('keydown', filterStudents);

function filterStudents(){
    showStudents();
    console.log('Filtering students')
    let pattern = document.getElementById('searchBox').value.toLowerCase();
    for(let i=0;i<studentsList.length;i++){
        let fullPattern = (studentsList[i].FirstName + studentsList.LastName).toLowerCase();
        if(!(fullPattern.match(pattern))){
            document.getElementById(studentsList[i]._id).remove();
        }

    }
}





function showStudents(){
    console.log("Displaying...")
    document.addEventListener('click', closeSearchBox)
    let container = document.getElementById('studnets-list');
    container.style.display='block';
    container.innerHTML=``;
    for(let i=0;i<studentsList.length;i++){
        let item = document.createElement('li');
        item.innerHTML=
        `
        <a href='/student/${studentsList[i]._id}' style='width:100%; '>
        <label style='display:inline'>${studentsList[i].FirstName} ${studentsList[i].LastName},Class:${studentsList[i].Class}, Father: ${studentsList[i].FathersName}</label>
        </a>
        `
        item.style.marginLeft='0'
        item.id=studentsList[i]._id
        container.appendChild(item); 
    }
}


function closeSearchBox(){
    document.getElementById('studnets-list').style.display = 'none';
    document.getElementById('searchBox').value=''
    document.getElementById('profile-details').style.display='none'
    document.removeEventListener('click', closeSearchBox);
    
}
