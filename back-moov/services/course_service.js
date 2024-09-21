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

const getCoursesByChauffeurAndPeriod = async (chauffeur_id, period) => {
    let interval;
    switch (period) {
        case 'semaine':
            interval = '1 week';
            break;
        case 'mois':
            interval = '1 month';
            break;
        case 'annee':
            interval = '1 year';
            break;
        default:
            throw new Error('Période non valide');
    }

    try {
        const totalCourses = await Course.getCourseCountByChauffeur(chauffeur_id, interval);
        return totalCourses;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des courses : ' + error.message);
    }
};

const getTotalCourses = async () => {
    try {
        const totalCourses = await Course.getTotalCourses();
        return totalCourses;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des courses : ' + error.message);
    }
};

const getTotalCoursesByPeriod = async (period) => {
    let interval;
    switch (period) {
        case 'semaine':
            interval = '1 week';
            break;
        case 'mois':
            interval = '1 month';
            break;
        case 'annee':
            interval = '1 year';
            break;
        default:
            throw new Error('Période non valide');
    }

    try {
        const totalCourses = await Course.getTotalCoursesByPeriod(interval);
        return totalCourses;
    } catch (error) {
        throw new Error('Erreur lors de la récupération des courses : ' + error.message);
    }
};

module.exports = {
    getCourseDetailsById,
    getTotalDistanceByChauffeur,
    getTotalDistanceByPassager,
    getTotalReservationsByClient,
    getTotalReservationsByChauffeur,
    getCoursesByChauffeurAndPeriod,
    getTotalCoursesByPeriod,
    getTotalCourses
};
