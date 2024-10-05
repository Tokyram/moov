const express = require('express');
const TokenDeviceUserController = require('../controllers/tokenDeviceUserController');
const router = express.Router();

router.post('/save-token', TokenDeviceUserController.saveTokenUser);

module.exports = router;
