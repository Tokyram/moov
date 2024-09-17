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

const getTotalDistanceByChauffeur = async (chauffeurId) => {
    try {
        const totalDistance = await Course.calculateTotalDistanceByChauffeur(chauffeurId);
        return totalDistance;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la distance totale : ' + error.message);
    }
};

const getTotalDistanceByPassager = async (passagerId) => {
    try {
        const totalDistance = await Course.calculateTotalDistanceBPassager(passagerId);
        return totalDistance;
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la distance totale : ' + error.message);
    }
};

module.exports = {
    getCourseDetailsById,
    getTotalDistanceByChauffeur,
    getTotalDistanceByPassager
};
