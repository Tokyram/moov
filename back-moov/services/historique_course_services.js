const Course = require('../models/historique_course');

const getCompletedCoursesByPassager = async (passagerId) => {
    try {
        const courses = await Course.findCompletedCoursesByPassager(passagerId);
        return courses;
    } catch (error) {
        throw new Error('Erreur dans le service de récupération des courses terminées : ' + error.message);
    }
};

const getCompletedCoursesByChauffeur = async (chauffeurId) => {
    try {
        const courses = await Course.findCompletedCoursesByChauffeur(chauffeurId);
        return courses;
    } catch (error) {
        throw new Error('Erreur dans le service de récupération des courses terminées pour le chauffeur : ' + error.message);
    }
};

const getCourseDetailsById = async (courseId) => {
    try {
        const course = await Course.findCourseById(courseId);
        return course;
    } catch (error) {
        throw new Error('Erreur dans le service de récupération des détails de la course : ' + error.message);
    }
};

module.exports = {
    getCompletedCoursesByPassager,
    getCompletedCoursesByChauffeur,
    getCourseDetailsById
};
