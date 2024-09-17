// routes/avisRoutes.js
const express = require('express');
const AvisController = require('../controllers/avis_controller.js');

const router = express.Router();

// Créer un avis
router.post('/creation_avis', AvisController.createAvis);

// Récupérer les avis d'un chauffeur
router.get('/chauffeur/:chauffeurId', AvisController.getAvisByChauffeur);

// Récupérer les avis d'un passager
router.get('/passager/:passagerId', AvisController.getAvisByPassager);

// Récupérer les avis d'une course
router.get('/course/:courseId', AvisController.getAvisByCourse);

module.exports = router;
