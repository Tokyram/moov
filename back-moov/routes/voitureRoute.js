const express = require('express');
const VoitureController = require('../controllers/voitureController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.get('/', authMiddleware, VoitureController.listCars);

module.exports = router;