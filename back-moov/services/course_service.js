const Course = require('../models/course'); 

const getCourseDetailsById = async (courseId, userId) => {
    try {
        const courseDetails = await Course.findCourseDetailsById(courseId, userId);
        return courseDetails;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la course dans le service :', error.message);
        throw new Error('Erreur lors de la récupération des détails de la course : ' + error.message);
    }
};

module.exports = {
    getCourseDetailsById
};
