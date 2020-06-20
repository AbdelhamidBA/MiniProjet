const express = require('express');
const router = express.Router();
const enseignant = require('../controllers/EnseignantController');

router.get('/:idens/seance', enseignant.ListSeance);
router.get('/:idseance/presence', enseignant.ListPresence);
router.get('/matiere', enseignant.getMatiere);
router.get('/filiere', enseignant.getFiliere);
router.get('/salle', enseignant.getSalle);
router.post('/:id_etd/upd', enseignant.UpdateEtudiant);
router.get('/statis', enseignant.statistic);

module.exports = router;