const express = require('express');
const router = express.Router();
const historique_course_controller = require('../controllers/historique_course_controller');

router.get('/historique/:id', historique_course_controller.getCompletedCourses);

module.exports = router;
