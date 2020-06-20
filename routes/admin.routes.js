const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/liststud', AdminController.listeEtudiant);
router.get('/stud/:studentId', AdminController.getEtudiant);
router.post('/addstud', AdminController.AddStudent);
router.patch('/updstud/:etudiantId', AdminController.updateStudent);
router.delete('/deletestud/:studentId', AdminController.deleteStudent);


module.exports = router;