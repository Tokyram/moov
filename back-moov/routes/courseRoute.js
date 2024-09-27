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
router.get('/chauffeur-attribue/:chauffeurId', authMiddleware, CourseController.listeReservationAttribues);
router.get('/attribue/:userId', authMiddleware, CourseController.listeReservationAttribuesUser);

router.get('/chauffeur/total-distance', authMiddleware, CourseController.getTotalDistanceByChauffeur);
router.get('/passager/total-distance', authMiddleware, CourseController.getTotalDistanceByPassager);
router.get('/passager/total-reservations', authMiddleware, CourseController.getTotalReservationsByClient);
router.get('/chauffeur/total-reservations', authMiddleware, CourseController.getTotalReservationsByChauffeur);
router.get('/commencer/:courseId', authMiddleware, CourseController.commencerCourse);
router.get('/terminer/:courseId', authMiddleware, CourseController.terminerCourse);

router.get('/chauffeurTotalCourse/:chauffeur_id/:period',authMiddleware, CourseController.getCoursesByChauffeur);
router.get('/totalCourses',authMiddleware, CourseController.getTotalCourses); // Total global
router.get('/totalCoursesPeriode/:period',authMiddleware, CourseController.getCoursesByPeriod);
module.exports = router;