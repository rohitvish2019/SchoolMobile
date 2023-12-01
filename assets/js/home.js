document.addEventListener('click', function(event){
    runListener(event.target.id);
});



function runListener(id){
    if(id.match(/delete.*/)){
        deleteMessage(id.slice(12));
    }
}

function deleteMessage(messageId){
    let response = window.confirm('Selected global notification will be deleted permanently, Please confirm !');
    
    if(response){
        $.ajax({
            url:'/message/delete/'+messageId,
            type:'delete',
            success: function(data){
                console.log(data.message);
                document.getElementById(data.id).style.display='none';
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show(); 
            },
            error: function(err){
                new Noty({
                    theme: 'relax',
                    text: JSON.parse(err.responseText.message),
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1500
                }).show(); 
            }
        })
    }
}
/*
let studentsList=[]
function setStudentsListLocal(){
    console.log('Getting...')
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

function filterStudents(){
    showStudents();
    let pattern = document.getElementById('search').value.toLowerCase();
    for(let i=0;i<studentsList.length;i++){
        let fullPattern = (studentsList[i].FirstName + studentsList.LastName).toLowerCase();
        if(!(fullPattern.match(pattern))){
            document.getElementById(studentsList[i]._id).remove();
        }

    }
}



//document.getElementById('search').addEventListener('click', showStudents);
document.getElementById('search').addEventListener('keydown', filterStudents);



function showStudents(){
    console.log("Displaying...")
    let container = document.getElementById('studnets-list');
    container.style.display='block';
    container.innerHTML=``;
    for(let i=0;i<studentsList.length;i++){
        let item = document.createElement('li');
        item.innerHTML=
        `
        <a href='/student/${studentsList[i]._id}' style='width:100%'>
        <label>${studentsList[i].FirstName} ${studentsList[i].LastName},Class:${studentsList[i].Class}, Father: ${studentsList[i].FathersName}</label>
        </a>
        `
        item.style.marginLeft='0'
        item.id=studentsList[i]._id
        container.appendChild(item);
    }
}

*/
function getSchoolProperties(){
    $.ajax({
        url:'/user/getProperties',
        type:'GET',
        success:function(data){putPropertiesonUI(data.schoolProperties)},
        error:function(err){console.log(err.responseText)}
    })
}

function putPropertiesonUI(properties){
    document.getElementById('school-name').innerText=properties.school_name;
    document.getElementById('mono').innerText = properties.mono;
    document.getElementById('logo').setAttribute('src',properties.imgdir+'/logo.png')
}

getSchoolProperties();