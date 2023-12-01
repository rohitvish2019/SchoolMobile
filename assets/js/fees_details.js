// To get fees data from sever of a student
function checkFees(){
    let adm = document.getElementById('AdmissionNoFees').innerText;
    $.ajax({
        url: '/fee/getMyFee',
        type:'GET',
        data:{
            AdmissionNo:adm,
        },
        success: function(data){showFees(data.data)},
        error: function(err){showNoFees()}
    });
    
}


function showFees(data){
    console.log(data.length);
    let container = document.getElementById('fee-details-container');
    container.innerHTML=``;
    let header = document.createElement('tr');
    header.innerHTML = 
    `
        <th>Class</th>
        <th>Total</th>
        <th>Concession</th>
        <th>Paid</th>
        <th>Remaining</th>
        <th>Actions</th>
    `
    container.appendChild(header);
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML = 
        `
        <td>${data[i].Class}</td>
        <td>${data[i].Total}</td>
        <td>${data[i].Concession}</td>
        <td>${data[i].Paid}</td>
        <td>${data[i].Remaining}</td>
        <td>
            <div class="dropdown">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                    Actions
                </a>
                <ul style='font-size:0.7rem' class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <li><button class='dropdown-item btn btn-success' id='pay_${data[i].Class}_${data[i].AdmissionNo}' onclick="openPopup('${data[i].Class}_${data[i].AdmissionNo}_submit')">Pay</button></li>
                    <li><button class='dropdown-item btn btn-success' id='concession_${data[i].Class}_${data[i].AdmissionNo}' onclick="openPopup('${data[i].Class}_${data[i].AdmissionNo}_con')">Concession</button></li> 
                </ul>
                
            </div>
        </td>
        `
        container.appendChild(item);
    }
    
}
// Invoke this function in case of no/error response received from checkFees to show no fees found

function showNoFees(){
    new Noty({
        theme: 'relax',
        text: 'No fees details found for the student in selected class',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show(); 
    console.log('no records');
    document.getElementById('fees-details').innerHTML=
    `
    <h4>No details available</h4>
    `
    document.getElementById('fee-submit-form').innerHTML=``
}



function closePopup(){
    document.getElementById('popup').style.display='none';
    classes = document.getElementsByClassName('class_option');
    for(let i=0;i<classes.length;i++){
        classes[i].removeAttribute('selected');
    }
    console.log(classes[0]);
    
}

function openPopup(data){
    console.log(data)
    document.getElementById('popup').style.display='block';
    let details = data.split('_');
    console.log(details);
    document.getElementById(details[0]).setAttribute('selected','true')
    //document.getElementById('fee-form').setAttribute('action','/fee/'+details[2])
    let action = '';
    if(details[2] === 'submit'){
        action = 'Fee'
    }else{
        action = 'Concession'
    }
    document.getElementById('purpose').setAttribute('value',action)
    
}

function cancelFees(id){
    $.ajax({
        url : '/fee/cancel/'+id,
        method: 'GET',
        success: function(data){
            document.getElementById(id).style.display = 'none'
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1500
            }).show();
        },
        error: function(err){
            console.log(err)
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1500
            }).show();
        }
    })
}

function submitFeeOrConcession(){
    let Date;
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    let Class = document.getElementById('Class_fee').value;
    if(document.getElementById('date_fee')){
        Date = document.getElementById('date_fee').value;
    }
    let Amount = document.getElementById('Amount_fee').value;
    let purpose = document.getElementById('purpose').value
    let Comment = document.getElementById('comment_fee').value;
    if(AdmissionNo == '' || Class == '' || Amount =='' || purpose == '' || Comment == ''){
        new Noty({
            theme: 'relax',
            text: 'All fields are mandatory',
            type: 'error',
            layout: 'topRight',
            timeout: 1000
        }).show();
        return;
    }
    $.ajax({
        url:'/fee/'+purpose,
        type:'post',
        data:{
            AdmissionNo,
            Class,
            Date,
            Amount,
            Comment
        },
        success:function(data){
            closePopup();
            new Noty({
                theme: 'relax',
                text: data.message,
                type: 'success',
                layout: 'topRight',
                timeout: 1000
            }).show();
            checkFees();
            
            
        },
        error: function(err){
            new Noty({
                theme: 'relax',
                text: JSON.parse(err.responseText).message,
                type: 'error',
                layout: 'topRight',
                timeout: 1000
            }).show();
            setTimeout(function(){
                window.location.href='/student/get/'+AdmissionNo+'?Class='+Class+'&action=fee'
            },1000)
        }
    })
}



function getConcessionHistory(){
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    $.ajax({
        type:'get',
        url:'/fee/getConcessionHistory/'+AdmissionNo,
        success: function(data){
            showConcessionHistory(data.data)
        }
    })
}


function showConcessionHistory(data){
    console.log(data);
    if(data.length <= 0){
        return;
    }
    let container = document.getElementById('concession-history-dynamic-container');
    console.log(container);
    container.innerHTML=``;

    let headerItem = document.createElement('tr');
    headerItem.innerHTML=
    `
        <th>AdmissionNo</th>
        <th>Class</th>
        <th>Amount</th>
        <th>Concession Date</th>
        <th>Comment</th>
        <th>Concession By</th>
    `
    headerItem.style.width='100%'
    container.appendChild(headerItem);
         
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            <td>${data[i].AdmissionNo}</td>
            <td>${data[i].Class}</td>
            <td>${data[i].Amount}</td>
            <td>${data[i].Payment_Date}</td>
            <td>${data[i].Comment}</td>
            <td>${data[i].PaidTo}</td>
        `
        container.appendChild(item);
    }
}


function getFeesHistory(){
    let AdmissionNo = document.getElementById('AdmissionNo_fee').value;
    $.ajax({
        type:'get',
        url:'/fee/getHistory/'+AdmissionNo,
        success: function(data){
            showFeesHistory(data.data)
        }
    })
}

function showFeesHistory(data){
    if(data.length <= 0){
        return;
    }
    let container = document.getElementById('fee-history-dynamic-container');
    container.innerHTML=``;
    let headerItem = document.createElement('tr');
    headerItem.innerHTML=
    `
        
        <th>Class</th>
        <th>Amount</th>
        <th>Payment Date</th>
        <th>Comment</th>
        <th>Actions</th>
        <th>Paid To</th>
    `
    headerItem.style.width='100%'
    container.appendChild(headerItem);
    for(let i=0;i<data.length;i++){
        let item = document.createElement('tr');
        item.innerHTML=
        `
            
            <td>${data[i].Class}</td>
            <td>${data[i].Amount}</td>
            <td>${data[i].Payment_Date.slice(0,10)}</td>
            <td>${data[i].Comment}</td>
            <td>
                <div class="dropdown" style='font-size:0.7rem;'>
                    <a class="btn btn-light dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        Actions
                    </a>
                    <ul style='font-size:0.7rem' class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li><a href='/fee/receipt/${data[i]._id}' class="dropdown-item btn btn-success">Get Recipt</a></li>
                        <li><a href='#' onclick=cancelFees('${data[i]._id}') class="dropdown-item btn btn-danger">Cancel</a></li>
                        
                    </ul>
                </div>
            </td>
            <td><a>${data[i].PaidTo}</a></td>
        `
        item.id = data[i]._id
        container.appendChild(item);
    }
}


function openPaymentHistory(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='transparent';
    document.getElementById('details-button').style.color='black';
    document.getElementById('history-button-pay').style.backgroundColor='#0a807c';
    document.getElementById('history-button-pay').style.color='white';
    document.getElementById('history-button-con').style.backgroundColor='transparent';
    document.getElementById('history-button-con').style.color='black';

    feeDetails.style.display='none';
    concessionHistory.style.display='none';
    feeHistory.style.display='block'

    getFeesHistory();

}

function openConcessionHistory(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='transparent';
    document.getElementById('details-button').style.color='black';
    document.getElementById('history-button-pay').style.backgroundColor='transparent';
    document.getElementById('history-button-pay').style.color='black';
    document.getElementById('history-button-con').style.backgroundColor='#0a807c';
    document.getElementById('history-button-con').style.color='white';

    feeDetails.style.display='none';
    concessionHistory.style.display='block';
    feeHistory.style.display='none'
    getConcessionHistory();
}

function openFeeDetails(){
    let feeHistory = document.getElementById('fee-history');
    let feeDetails = document.getElementById('fee-details');
    let concessionHistory = document.getElementById('concession-history');

    document.getElementById('details-button').style.backgroundColor='#0a807c';
    document.getElementById('details-button').style.color='white';
    document.getElementById('history-button-pay').style.backgroundColor='transparent';
    document.getElementById('history-button-pay').style.color='black';
    document.getElementById('history-button-con').style.backgroundColor='transparent';
    document.getElementById('history-button-con').style.color='black';

    feeDetails.style.display='block';
    concessionHistory.style.display='none';
    feeHistory.style.display='none'
    checkFees();

}

document.getElementById('details-button').addEventListener('click', openFeeDetails);
document.getElementById('history-button-pay').addEventListener('click', openPaymentHistory);
document.getElementById('history-button-con').addEventListener('click', openConcessionHistory);


//Check fees button listener
let check_fees_button = document.getElementById('check-fees');
let cross = document.getElementById('cross');
if(check_fees_button){
    check_fees_button.addEventListener('click', checkFees);
}
if(cross){
    cross.addEventListener('click', closePopup)
}


