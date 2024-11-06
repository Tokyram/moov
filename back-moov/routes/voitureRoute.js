const express = require('express');
const VoitureController = require('../controllers/voitureController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/creationVoiture',authMiddleware, upload.single('photo'), VoitureController.createVoiture);
router.get('/getVoitureId/:id',authMiddleware, VoitureController.getVoitureById);
router.put('/modifierVoiture/:id',authMiddleware, upload.single('photo'), VoitureController.updateVoiture);
router.delete('/SupprimerVoiture/:id',authMiddleware, VoitureController.deleteVoiture);

router.get('/getAllVoiture',authMiddleware, VoitureController.getAllVoitures);

// router.delete('/SupprimerPhotosVoiture/:id', VoitureController.deletePhotosByVoitureId);
// router.post('/creationPhotoVoitures', VoitureController.addPhotoToVoiture);

module.exports = router;
