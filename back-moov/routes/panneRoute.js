const express = require('express');
const PanneController = require('../controllers/panneController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/CreationSignalerPanne',authMiddleware, PanneController.insertPanne);

router.get('/getTypesPanne',authMiddleware, PanneController.getTypes);
router.post('/ajouterTypePanne',authMiddleware, PanneController.insertTypePanne);
module.exports = router;
