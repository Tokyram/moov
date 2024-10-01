const express = require('express');
const FactureController = require('../controllers/factureController');
const authMiddleware = require('../middleware/auth');
const { route } = require('./courseRoute');

const router = express.Router();

router.get('/', authMiddleware, FactureController.getListeFacture);
router.get('/:factureId', authMiddleware, FactureController.getDetailFacture);