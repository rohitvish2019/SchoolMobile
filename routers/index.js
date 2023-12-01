const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('passport-local');
const userController = require('../controller/user');
const LocalStrategy = require('../config/passport-local-strategy');
router.use('/admissions', passport.checkAuthentication, require('./addmission'));
router.use('/registration', passport.checkAuthentication, require('./registration'));
router.use('/student',passport.checkAuthentication, require('./student'));
router.use('/fee', passport.checkAuthentication, require('./fee'));
router.use('/result', passport.checkAuthentication, require('./result'));
router.use('/documents', passport.checkAuthentication, require('./documents'))
router.use('/reports', passport.checkAuthentication, require('./reports'));
router.use('/teachers', passport.checkAuthentication, require('./Teachers'));
router.use('/message', passport.checkAuthentication, require('./message'));
router.use('/user', require('./user'));
router.use('/attendance', passport.checkAuthentication, require('./Attendance'));
router.use('/ebooks', passport.checkAuthentication, require('./ebooks'));
router.use('/balance',passport.checkAuthentication,require('./balanceSheet'))
router.get('/', userController.mainHome);


module.exports = router;