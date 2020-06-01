const express = require('express');
const router = express.Router();
const enseignant = require('../controllers/EnseignantController');

router.get('/:idens/seance', enseignant.ListSeance);
router.get('/:idseance/presence', enseignant.ListPresence);
router.get('/matiere', enseignant.getMatiere);
router.get('/filiere', enseignant.getFiliere);
router.post('/upd', enseignant.UpdateEtudiant);
router.post('/add', enseignant.InsertMatiere);
router.get('/statis', enseignant.statistic);

module.exports = router;