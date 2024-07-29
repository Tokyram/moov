const express = require('express');
const UtilisateurController = require('../controllers/utilisateurController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', UtilisateurController.register);
router.post('/login', UtilisateurController.login);
router.post('/verify-login', UtilisateurController.verificationLogin);
router.get('/profile', authMiddleware, UtilisateurController.getProfile);

module.exports = router;