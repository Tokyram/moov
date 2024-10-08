const express = require('express');
const ChauffeurController = require('../controllers/chauffeurController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/insertionChauffeur', authMiddleware, ChauffeurController.insertChauffeur);
router.post('/updateChauffeurPosition', authMiddleware, ChauffeurController.updatePosition);
router.get('/kilometre/:chauffeur_id', authMiddleware, ChauffeurController.getKilometresByChauffeur);
router.get('/kilometrePassager/:passager_id', authMiddleware, ChauffeurController.getKilometresByPassager);
module.exports = router;
