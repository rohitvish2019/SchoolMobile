const express = require('express');
const router = express.Router();
const ebooksController = require('../controller/ebooks');

router.get('/home', ebooksController.home);
router.get('/get', ebooksController.getEbooks);

module.exports = router;