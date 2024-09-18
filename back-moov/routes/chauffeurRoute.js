const express = require('express');
const ChauffeurController = require('../controllers/chauffeurController');
const router = express.Router();

router.post('/insertionChauffeur', ChauffeurController.insertChauffeur);

module.exports = router;
