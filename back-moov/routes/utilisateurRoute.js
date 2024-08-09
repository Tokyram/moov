const express = require('express');
const UtilisateurController = require('../controllers/utilisateurController');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.post('/register', UtilisateurController.register);
router.post('/login', UtilisateurController.login);
router.get('/profile', authMiddleware, UtilisateurController.getProfile);
router.post('/verify-registration', UtilisateurController.verifyRegistration);
router.post('/initiate-reset-password', UtilisateurController.initiateresetPassword);
router.post('/verify-reset-password', UtilisateurController.verifyResetPassword);
router.post('/apply-reset-password', UtilisateurController.applyResetPassword);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.put('/profile', authMiddleware, upload.single('photo'), UtilisateurController.updateProfile);
router.get('/photo/:filename', UtilisateurController.servePhoto);
router.get('/list', authMiddleware, UtilisateurController.listUsers);
router.put('/bannir/:userId', authMiddleware, UtilisateurController.bannirUser);

module.exports = router;