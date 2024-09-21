const Course = require('../models/course'); 

const getCourseDetailsById = async (courseId) => {
    try {
        const courseDetails = await Course.findCourseDetailsById(courseId);
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

const getTotalReservationsByClient = async (clientId) => {
    try {
        const totalReservations = await Course.countReservationsByClient(clientId);
        return totalReservations;
    } catch (error) {
        throw new Error('Erreur lors de la récupération du nombre de réservations : ' + error.message);
    }
};

const getTotalReservationsByChauffeur = async (chauffeurId) => {
    try {
        const totalReservations = await Course.countReservationsByChauffeur(chauffeurId);
        return totalReservations;
    } catch (error) {
        throw new Error('Erreur lors de la récupération du nombre de réservations : ' + error.message);
    }
};

module.exports = {
    getCourseDetailsById,
    getTotalDistanceByChauffeur,
    getTotalDistanceByPassager,
    getTotalReservationsByClient,
    getTotalReservationsByChauffeur
};
