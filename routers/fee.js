const express = require('express');
const router = express.Router();
const feeController = require('../controller/fee');
router.get('/getFee/:id', feeController.getFeeDetails);
router.get('/getMyFee', feeController.getFee)

router.get('/updateFeeForm', feeController.updateFeeForm);
router.post('/updateFee', feeController.updateFee);
router.post('/getConsession', feeController.addConsession);
router.post('/Fee', feeController.feeSubmission);
router.post('/Concession', feeController.addConsession);
router.get('/getHistory/:AdmissionNo', feeController.getFeeHistory);
router.get('/getConcessionHistory/:AdmissionNo', feeController.getConcessionHistory)
router.get('/receipt/:id',feeController.getFeeReceipt);
router.get('/cancel/:id', feeController.cancelFees);
router.delete('/delete/:Class', feeController.deleteAnnualFee);

module.exports = router;