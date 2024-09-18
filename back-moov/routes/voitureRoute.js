const express = require('express');
const VoitureController = require('../controllers/voitureController');
const router = express.Router();

router.post('/creationVoiture', VoitureController.createVoiture);
router.get('/getVoitureId/:id', VoitureController.getVoitureById);
router.put('/modifierVoiture/:id', VoitureController.updateVoiture);
router.delete('/SupprimerVoiture/:id', VoitureController.deleteVoiture);

router.get('/getAllVoiture', VoitureController.getAllVoitures);

router.delete('/SupprimerPhotosVoiture/:id', VoitureController.deletePhotosByVoitureId);
router.post('/creationPhotoVoitures', VoitureController.addPhotoToVoiture);

module.exports = router;
