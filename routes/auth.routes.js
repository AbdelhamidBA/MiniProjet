const express = require('express');
const router = express.Router();
const AuthenticationController = require('../controllers/AuthenticationController');


router.post('/login', AuthenticationController.login);
router.post('/register', AuthenticationController.RegisterUser);
router.post('/add/admin', AuthenticationController.AdminRegister);
module.exports = router;