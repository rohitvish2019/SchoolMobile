const express = require('express');
const router = express.Router();
const admissonController = require('../controller/admission');



//old code
/*
router.get('/',admissonController.addmission);
router.post('/create', admissonController.addStudent)
*/
router.post('/updateLastAdmission', admissonController.updateLastAdmission);
/*
router.post('/getPreview', admissonController.getPreview);
router.get('/getProfile/:id', admissonController.getProfile);
*/
module.exports = router;