const express = require('express');
const router = express.Router();
const historique_course_controller = require('../controllers/historique_course_controller');
const authMiddleware = require('../middleware/auth');

router.get('/historique/passager/:id',authMiddleware, historique_course_controller.getCompletedCourses);
router.get('/historique/chauffeur/:id',authMiddleware, historique_course_controller.getCompletedCoursesByChauffeur);
router.get('/details/:id',authMiddleware, historique_course_controller.getCourseDetails);

module.exports = router;
