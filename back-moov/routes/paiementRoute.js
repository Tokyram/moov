const express = require('express');
const PaiementController = require('../controllers/paiementController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/initier-paiement', authMiddleware, PaiementController.initierPaiement);
router.post('/confirmer-paiement', authMiddleware, PaiementController.confirmerPaiement);

module.exports = router;