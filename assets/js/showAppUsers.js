function getAllUsers(){
    $.ajax({
        url:'/user/getAll',
        type:'Get',
        success: function(data){showUsers(data.users)},
        error: function(err){console.log(err)}
    })
}

function showUsers(data){
    console.log(data);
    let container = document.getElementById('usersDetails');
    container.innerHTML =
    `
    <tr>
        <th>Name</th>
        <th>Username</th>
        <th>Role</th>
        <th>Address</th>
        <th>Actions</th>
    </tr>
    `
    
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            <td>${data[i].full_name}</td>
            <td>${data[i].email}</td>
            <td>${data[i].role}</td>
            <td>${data[i].address}</td>
            <td>
                <button onclick=deleteUser('${data[i]._id}') class = 'btn btn-danger'>Delete</button>
            </td>
        `
        item.id=data[i]._id
        container.appendChild(item);
    }
}
getAllUsers();

function deleteUser(user_id){
    $.ajax({
        url:'/user/delete/'+user_id,
        type:'Delete',
        success:function(data){
            document.getElementById(user_id).remove();
        },
        error:function(err){
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