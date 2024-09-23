const express = require('express');
const ChauffeurController = require('../controllers/chauffeurController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/insertionChauffeur', authMiddleware, ChauffeurController.insertChauffeur);
router.post('/updateChauffeurPosition', authMiddleware, ChauffeurController.updatePosition);

module.exports = router;
