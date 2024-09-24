const express = require('express');
const TraitementCourseUtilisateurController = require('../controllers/traitementCourseUtilisateurController');
const router = express.Router();

router.get('/enCours/:utilisateurId', TraitementCourseUtilisateurController.findTraitement);

module.exports = router;