// services/avisService.js
const Avis = require('../models/avis');

class AvisService {
    static async createAvis(passagerId, chauffeurId, etoiles, commentaire, courseId, auteur) {
        try {
            return await Avis.createAvis(passagerId, chauffeurId, etoiles, commentaire, courseId, auteur);
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'avis : ' + error.message);
        }
    }

    static async getAvisByChauffeur(chauffeurId) {
        try {
            return await Avis.getAvisByChauffeur(chauffeurId);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour le chauffeur : ' + error.message);
        }
    }

    static async getAvisByPassager(passagerId) {
        try {
            return await Avis.getAvisByPassager(passagerId);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour le passager : ' + error.message);
        }
    }

    static async getAvisByCourse(courseId) {
        try {
            return await Avis.getAvisByCourse(courseId);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour la course : ' + error.message);
        }
    }
}

module.exports = AvisService;
