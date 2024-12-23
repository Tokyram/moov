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
router.put('/commencer/:courseId', authMiddleware, CourseController.commencerCourse);
router.put('/terminer/:courseId', authMiddleware, CourseController.terminerCourse);

router.get('/chauffeurTotalCourse/:chauffeur_id/:period',authMiddleware, CourseController.getCoursesByChauffeur);

router.get('/chauffeursCourseCount',authMiddleware, CourseController.getChauffeursWithCourseCount);
router.get('/totalCourses',authMiddleware, CourseController.getTotalCourses); // Total global
// router.get('/totalCoursesPeriode/:period',authMiddleware, CourseController.getCoursesByPeriod);
router.get('/totalCoursesPeriode/:periodType/:year?', authMiddleware,CourseController.getTotalCoursesByPeriod);
router.get('/totalRevenuePeriode/:periodType/:year?', authMiddleware,CourseController.getTotalRevenueByPeriod);
router.get('/historique-user/:userId', authMiddleware,CourseController.historiqueReservationUser);
router.get('/historique-chauffeur/:chauffeurId', authMiddleware,CourseController.historiqueReservationChauffeur);


router.get('/total-revenue',authMiddleware, CourseController.getTotalRevenueController);
module.exports = router;