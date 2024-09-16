const courseService = require('../services/historique_course_services');

const getCompletedCourses = async (req, res) => {
    const passagerId = req.params.id;

    try {
        const courses = await courseService.getCompletedCoursesByPassager(passagerId);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCompletedCourses
};
