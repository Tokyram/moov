const express = require('express');
const TarifsController = require('../controllers/tarifsController');
const router = express.Router();

router.get('/', TarifsController.getTarif);

module.exports = router;
