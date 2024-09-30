const express = require('express');
const router = express.Router();
const HistoriqueCourseController = require('../controllers/historiqueCourseController');
const authMiddleware = require('../middleware/auth');

router.get('/historique/passager/:id',authMiddleware, HistoriqueCourseController.getCompletedCourses);
router.get('/historique/chauffeur/:id',authMiddleware, HistoriqueCourseController.getCompletedCoursesByChauffeur);
router.get('/details/:id',authMiddleware, HistoriqueCourseController.getCourseDetails);
router.get('/AllHistoriqueCourse',authMiddleware, HistoriqueCourseController.findCompletedCoursesAll);
module.exports = router;
