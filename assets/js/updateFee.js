document.addEventListener('click', runListener);

function runListener(event){
    let actionClass= event.target.id
    console.log('ID is '+actionClass)
    if(actionClass.match(/updateFee.*/)){
        console.log(actionClass.slice(10))
        $.ajax({
            type: 'POST',
            url: '/fee/updateFee',
            data:{
                Class : actionClass.slice(10),
                Fees : document.getElementById('feesInput_'+actionClass.slice(10)).value
            },
            success: function(data){
                console.log('Fees updates')
                window.location.href='/fee/updateFeeForm'
            },
            error: function(err){
                console.error.bind(err);
            }
        })
    }
    else if(actionClass.match(/editFee.*/)){
        document.getElementById('updateFee_'+actionClass.slice(8)).removeAttribute('hidden');
        console.log('feesInput_'+actionClass.slice(8))
        document.getElementById('feesInput_'+actionClass.slice(8)).removeAttribute('readonly');
        document.getElementById('feesInput_'+actionClass.slice(8)).style.border='1px solid black';
        document.getElementById('actions_'+actionClass.slice(8)).setAttribute('hidden','true')
    }
    else if(actionClass.match(/deleteFee.*/)){
        console.log("In delete flow  ID is "+actionClass.slice(10))
        $.ajax({
            type:'delete',
            url:'/fee/delete/'+actionClass.slice(10),
            success: function(data){
                console.log(data.message);
                document.getElementById(actionClass.slice(10)).style.display='none'
                new Noty({
                    theme: 'relax',
                    text: data.message,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            },
            error: function(err){
                console.log(err.responseText)
            }
        })
    }
    else{
        console.log('wrong target')
    }
}