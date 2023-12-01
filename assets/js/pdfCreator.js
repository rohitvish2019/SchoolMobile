console.log('PDF creator loaded')
const button1 = document.getElementById('download-button');
if(button1 != null){
    button1.addEventListener('click', generatePDFAdmissionForm);
}

const button2 = document.getElementById('download-marksheet');
if(button2 != null){
    button2.addEventListener('click', generatePDFMarksheet);
}



const button3 = document.getElementById('tc-download');

if(button3 != null){
    button3.addEventListener('click', generatePDFTC);
}

// To generate the pdf of admission form
function generatePDFAdmissionForm() {   
    document.getElementById('General-info').style.display = 'flex'
    document.getElementById('Parents-Information').style.display = 'flex'
    document.getElementById('Last-School-Record').style.display = 'flex'
    document.getElementById('Bank-Information').style.display = 'flex'
    new Noty({
        theme: 'relax',
        text: 'Admission form is downloading',
        type: 'success',
        layout: 'topRight',
        timeout: 1500
    }).show();
    let firstname = document.getElementById('fname').value;
    let lastname = document.getElementById('lname').value;
    let admissionno = document.getElementById('admno').value;
    var opt = {
        margin:       0.63,
        filename:     firstname+'_'+lastname+'_'+admissionno,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    // Choose the element that your content will be rendered to.
    console.log('creating pdf');
    let element = document.getElementById('toPDF');
    // Choose the element and save the PDF for your user.
    html2pdf(element, opt);
    console.log(element);
    html2pdf().set(opt).from(element).save();
    window.location.href='/student/'+document.getElementById('id').value
    
}


function generatePDFMarksheet() {   
    
    let student_name = document.getElementById('student_name').innerText;
    let admissionno = document.getElementById('admno').innerText;
    var opt = {
        margin:       0.63,
        filename: 'Marksheet',
        filename:     student_name+'_'+admissionno+'_marksheet',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    // Choose the element that your content will be rendered to.
    console.log('creating pdf');
    let element = document.getElementById('marksheet');
    // Choose the element and save the PDF for your user.
    html2pdf(element, opt);
    console.log(element);
    html2pdf().set(opt).from(element).save();
}


function generatePDFTC() {   
    
    let student_name = document.getElementById('student_name').value;
    let admissionno = document.getElementById('admno').value;
    var opt = {
        margin:       0.63,
        filename: 'Marksheet',
        filename:     student_name+'_'+admissionno+'_marksheet',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    // Choose the element that your content will be rendered to.
    console.log('creating pdf');
    let element = document.getElementById('tc-body');
    // Choose the element and save the PDF for your user.
    html2pdf(element, opt);
    console.log(element);
    html2pdf().set(opt).from(element).save("/abc")
}