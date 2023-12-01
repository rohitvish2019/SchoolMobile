const express = require('express');
const router = express.Router();
const messageController = require('../controller/message');
router.get('/new', messageController.newMessage);
router.post('/addNew', messageController.addMessageSchool);
router.delete('/delete/:id', messageController.deleteMessage);
router.get('/notifications', messageController.getNotifications);
module.exports = router;