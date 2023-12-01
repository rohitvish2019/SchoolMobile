const express = require('express');
const router = express.Router();
const BSController = require('../controller/balanceSheet');
router.get('/home',BSController.home);
module.exports = router;