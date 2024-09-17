// controllers/avisController.js
const AvisService = require('../services/avis_service');

class AvisController {
    static async createAvis(req, res) {
        const { passagerId, chauffeurId, etoiles, commentaire, courseId, auteur } = req.body;

        try {
            const avis = await AvisService.createAvis(passagerId, chauffeurId, etoiles, commentaire, courseId, auteur);
            res.status(201).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByChauffeur(req, res) {
        const { chauffeurId } = req.params;

        try {
            const avis = await AvisService.getAvisByChauffeur(chauffeurId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByPassager(req, res) {
        const { passagerId } = req.params;

        try {
            const avis = await AvisService.getAvisByPassager(passagerId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByCourse(req, res) {
        const { courseId } = req.params;

        try {
            const avis = await AvisService.getAvisByCourse(courseId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AvisController;
