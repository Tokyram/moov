const express = require('express');
const PanneController = require('../controllers/panneController');
const router = express.Router();

router.post('/CreationSignalerPanne', PanneController.insertPanne);

router.get('/getTypesPanne', PanneController.getTypes);
router.post('/ajouterTypePanne', PanneController.insertTypePanne);
module.exports = router;
