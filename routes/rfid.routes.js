const express = require('express');
const router = express.Router();
const RFIDController = require('../controllers/RFIDController');

router.post('/add', RFIDController.InsertMatiere)
router.post('/ouverturesession', RFIDController.OuvertureSession)
router.post('/marquagepres', RFIDController.MarquagePres)
module.exports = router;