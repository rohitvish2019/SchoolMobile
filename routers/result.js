const express = require('express');
const router = express.Router();
const resultController = require('../controller/result')
router.get('/get', resultController.getResult);
router.post('/update', resultController.updateResult);
router.post('/updateAll/:AdmissionNo', resultController.updateAllResults);
router.get('/search/:id', resultController.searchResult);
router.get('/subjects', resultController.getSubjectsListWithMarks);
router.get('/terms', resultController.getTerms);
module.exports = router;