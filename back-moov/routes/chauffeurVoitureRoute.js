const express = require('express');
const ChauffeurVoitureController = require('../controllers/chauffeurVoitureController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.post('/assignation', authMiddleware, ChauffeurVoitureController.assignationVoitureChauffeur);
router.get('/liste', authMiddleware, ChauffeurVoitureController.listeAssignationChauffeurVoiture);

module.exports = router;