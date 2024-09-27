const express = require('express');
const VoitureController = require('../controllers/voitureController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/creationVoiture',authMiddleware, VoitureController.createVoiture);
router.get('/getVoitureId/:id',authMiddleware, VoitureController.getVoitureById);
router.put('/modifierVoiture/:id',authMiddleware, VoitureController.updateVoiture);
router.delete('/SupprimerVoiture/:id',authMiddleware, VoitureController.deleteVoiture);

router.get('/getAllVoiture',authMiddleware, VoitureController.getAllVoitures);

// router.delete('/SupprimerPhotosVoiture/:id', VoitureController.deletePhotosByVoitureId);
// router.post('/creationPhotoVoitures', VoitureController.addPhotoToVoiture);

module.exports = router;
