const express = require('express');
const router = express.Router();
const historique_course_controller = require('../controllers/historique_course_controller');

router.get('/historique/passager/:id', historique_course_controller.getCompletedCourses);
router.get('/historique/chauffeur/:id', historique_course_controller.getCompletedCoursesByChauffeur);
module.exports = router;
