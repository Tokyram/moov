const express = require('express');
const CourseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/reserver', authMiddleware, CourseController.reserver);
router.get('/attente', authMiddleware, CourseController.findReservationAttente);

module.exports = router;