const express = require('express');
const CourseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/reserver', authMiddleware, CourseController.reserver);
router.get('/attente', authMiddleware, CourseController.findReservationAttente);
router.post('/accepter', authMiddleware, CourseController.accepterCourseChauffeur);
router.post('/refuser', authMiddleware, CourseController.refuserCourseChauffeur);
router.get('/chauffeurs-acceptes/:courseId', authMiddleware, CourseController.getChauffeurAcceptes);
router.get('/details_course/:courseId', authMiddleware, CourseController.getCourseDetails);
router.get('/chauffeur/total-distance', authMiddleware, CourseController.getTotalDistanceByChauffeur);
router.get('/passager/total-distance', authMiddleware, CourseController.getTotalDistanceByPassager);

module.exports = router;