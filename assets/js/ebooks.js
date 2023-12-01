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


function getEbooks(){
    
    $.ajax({
        type:'Get',
        url:'/ebooks/get',
        data:{
            Medium:document.getElementById('Medium').value,
            Class:document.getElementById('Class').value,
            Board:document.getElementById('Board').value,
        },
        success: function(data){showeBooks(data.data);},
        error:function(err){console.log(err.responseTextesponseText)}
    })
}

function showeBooks(books){
    console.log(books);
    let container = document.getElementById('ebooks-container');
    container.innerHTML=``;
    for(let i=0;i<books.length;i++){
        let element = document.createElement('a');
        element.href = books[i].Link;
        element.innerHTML=`<label>${books[i].Title.toUpperCase()}</label> (${books[i].Subject.toUpperCase()})<label></label>`;
        element.classList.add('btn')
        element.classList.add('btn-success')
        container.appendChild(element);
    }
}

getSchoolProperties();