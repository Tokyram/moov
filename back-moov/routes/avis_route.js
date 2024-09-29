// routes/avisRoutes.js
const express = require('express');
const AvisController = require('../controllers/avis_controller.js');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Créer un avis
router.post('/creation_avis', authMiddleware, AvisController.createAvis);

// Récupérer les avis d'un chauffeur
router.get('/chauffeur/:chauffeurId', authMiddleware, AvisController.getAvisByChauffeur);

// Récupérer les avis d'un passager
router.get('/passager/:passagerId', authMiddleware, AvisController.getAvisByPassager);

// Récupérer les avis d'une course
router.get('/course/:courseId', authMiddleware, AvisController.getAvisByCourse);

module.exports = router;
