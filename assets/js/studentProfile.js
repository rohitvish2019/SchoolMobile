document.getElementById('edit-profile').addEventListener('click', makeFormEditable)

function makeFormEditable(){
    let inputs = document.getElementsByClassName("form-input");
    document.getElementById('submit-form').removeAttribute('hidden')
    document.getElementById('download-button').setAttribute('hidden','true')
    document.getElementById('edit-profile').setAttribute('hidden','true')
    for(let i=0;i<inputs.length;i++){
        inputs[i].removeAttribute('readonly');
        inputs[i].style.border='1px solid black'
    }
    document.getElementById('General-info').style.display = 'flex'
    document.getElementById('Parents-Information').style.display = 'flex'
    document.getElementById('Last-School-Record').style.display = 'flex'
    document.getElementById('Bank-Information').style.display = 'flex'

    document.getElementById('class').setAttribute('readonly','true')
    document.getElementById('admno').setAttribute('readonly','true')
    document.getElementById('session').setAttribute('readonly','true')

}



let items = document.getElementsByClassName('showHideInfo');
for(let i=0;i<items.length;i++){
    items[i].addEventListener('click', function(event){showHideInfo(event.target.id)})
}

document.getElementById('General-info').style.display = 'none'
document.getElementById('Parents-Information').style.display = 'none'
document.getElementById('Last-School-Record').style.display = 'none'
document.getElementById('Bank-Information').style.display = 'none'

function showHideInfo(id){
    console.log(id);
    let element=''
    if(id === 'General'){
        element = document.getElementById('General-info');
    }
    else if(id=== 'Parents'){
        element = document.getElementById('Parents-Information');
    }
    else if(id=== 'Last-School'){
        element = document.getElementById('Last-School-Record');
    }
    else if( id === 'Bank'){
        element = document.getElementById('Bank-Information');
    }
    console.log(element);
    if(element.style.display == 'none'){
        document.getElementById(id).innerText='Hide'
        element.style.display='flex'
    }else{
        document.getElementById(id).innerText='Show'
        element.style.display='none'
    }
}