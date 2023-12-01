const express = require('express');
const router = express.Router();
console.log('request reached to router')
const documentsController = require('../controller/documents');
router.get('/', documentsController.documentsHome);
module.exports = router;
