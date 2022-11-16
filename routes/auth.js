const express = require('express');
const router = express.Router();
const regis_controller = require('../controllers/auth_account');

router.post('/register', regis_controller.addUser);
router.post('/login', regis_controller.loginUser);
router.post('/addStudent', regis_controller.addStudent);

router.get('/updateStudentForm/:email', regis_controller.updateStudentForm);
router.post('/updateStudent', regis_controller.updateStudent);
router.get('/deleteStudent/:email', regis_controller.deleteStudent);
router.get('/logout', regis_controller.logoutAccount);

module.exports = router;