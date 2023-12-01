
function getFeesReport(){
    $.ajax({
        type:'Get',
        url:'/reports/getFeeReport',
        data:{
            fromDate:document.getElementById('fromDate').value,
            toDate:document.getElementById('toDate').value
        },
        success: function(data){
            showFeeReport(data.data);
        }
    })
}

function showFeeReport(data){
    console.log(data);
    let container = document.getElementById('fee-report-container');
    container.innerHTML=``;
    let header = document.createElement('div');
    header.classList.add('list-heading')
    header.innerHTML=
    `
    <label class='list-item'>Admission No</label>
    <label class='list-item'>Class</label>
    <label class='list-item'>Type</label>
    <label class='list-item'>Amount</label>
    <label class='list-item'>Payment date</label>
    `

    container.appendChild(header);
}

document.getElementById('getFeeReport').addEventListener('click',getFeesReport);