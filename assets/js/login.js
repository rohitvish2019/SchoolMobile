function showHidePassword(){
    let item = document.getElementById('password');
    if(document.getElementById('showHide').checked){
        item.type = 'text'
    }else{
        item.type = 'password'
    }
}