const express = require('express');
const router = express.Router();
const AttendanceController = require('../controller/Attendance');
router.get('/students/home', AttendanceController.studentHome);
router.post('/students/update', AttendanceController.updateAttendance);
router.get('/students/get', AttendanceController.getAttendance)
module.exports = router;