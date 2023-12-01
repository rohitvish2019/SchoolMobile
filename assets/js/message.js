document.addEventListener('click',function(event){
    let id = event.target.id;
    runListener(id)
});


document.getElementById('Category').addEventListener('change', updateForm)


function updateForm(){
    let value = document.getElementById('Category').value;
    if(value === 'Class'){
        document.getElementById('ClassSelector').removeAttribute('hidden');
        document.getElementById('IndividualSearch').setAttribute('hidden','true')
    }
    else if(value === 'Individual'){
        document.getElementById('IndividualSearch').removeAttribute('hidden');
        document.getElementById('ClassSelector').setAttribute('hidden', 'true')
    }
    else{
        document.getElementById('IndividualSearch').setAttribute('hidden','true')
        document.getElementById('ClassSelector').setAttribute('hidden', 'true')
    }
}

function runListener(id){
    if(id === 'sendMessage'){
        let Category = document.getElementById('Category').value;
        if(Category === 'School'){
            sendNewMessage(Category,'');
        }
        else if(Category === 'Class'){
            let Class = document.getElementById('ClassSelector').value;
            if(Class === ''){
                new Noty({
                    theme: 'relax',
                    text: "Class not selected",
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1000
                }).show();
                return;
            }
            else{
                sendNewMessage(Category,Class)
            }
        }
        else if(Category === 'Individual'){
            let Individual = document.getElementById('IndividualSearch').value;
            if(Individual === ''){
                new Noty({
                    theme: 'relax',
                    text: "No receiver selected",
                    type: 'error',
                    layout: 'topRight',
                    timeout: 1000
                }).show();
                return;
            }else{
                sendNewMessage(Category, Individual);
            }
        }
        
        
    }
}


function sendNewMessage(Category, Value){
    let Heading = document.getElementById('heading').value;
    let Message = document.getElementById('Message').value;
    if(Heading == '' || Message == '' || Category == ''){
        new Noty({
            theme: 'relax',
            text: 'Mandatory Values are empty',
            type: 'error',
            layout: 'topRight',
            timeout: 1000
        }).show();
        return;
    }
    $.ajax({
        type:'POST',
        url:'/message/addNew',
        data:{
            Heading,
            Message,
            Category,
            Value
        },
        success: function(data){
            console.log(data)
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            document.getElementById('heading').value='';
            document.getElementById('Message').value='';

            
        },
        error: function(err){
            console.log(JSON.parse(err.responseText).message)
        }
    })
}