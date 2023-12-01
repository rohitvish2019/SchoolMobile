const express = require('express');
const router = express.Router();
const RegistrationController = require('../controller/registration');

router.get('/new', RegistrationController.registrationUI);
router.post('/getPreview', RegistrationController.getPreview);
router.post('/create', RegistrationController.register);
router.post('/update', RegistrationController.updateRegistration);
router.delete('/delete/:id', RegistrationController.delete);
router.post('/admit/:id', RegistrationController.admit);
router.get('/download/:id', RegistrationController.download);

module.exports = router;