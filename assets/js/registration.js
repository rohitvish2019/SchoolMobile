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

function getClassList(){
    $.ajax({
        url:'/user/getClassList',
        type:'Get',
        success:function(data){
            classes= data.classes;
            console.log(classes[0]);
            let selectContainer = document.getElementById('classList');
            selectContainer.innerHTML=``;
            for(let i=0;i<classes.length;i++){
                let item = document.createElement('option');
                item.innerText=classes[i];
                item.value=classes[i];
                selectContainer.appendChild(item);
            }
        }
    })
}

getSchoolProperties();
getClassList()