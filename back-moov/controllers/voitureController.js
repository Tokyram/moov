// controllers/voitureController.js
const VoitureService = require('../services/voitureService');

class VoitureController {
    static async createVoiture(req, res) {
        const { marque, modele, immatriculation } = req.body;
        try {
            const newVoiture = await VoitureService.createVoiture({ marque, modele, immatriculation });
            res.status(201).json(newVoiture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getVoitureById(req, res) {
        const { id } = req.params;
        try {
            const voiture = await VoitureService.getVoitureById(id);
            res.status(200).json(voiture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateVoiture(req, res) {
        const { id } = req.params;
        const { marque, modele, immatriculation } = req.body;
        try {
            const updatedVoiture = await VoitureService.updateVoiture(id, { marque, modele, immatriculation });
            res.status(200).json(updatedVoiture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteVoiture(req, res) {
        const { id } = req.params;
        try {
            const deletedVoiture = await VoitureService.deleteVoiture(id);
            res.status(200).json(deletedVoiture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deletePhotosByVoitureId(req, res) {
        const { id } = req.params;
        try {
            const deletedVoiture = await VoitureService.deletePhotosByVoitureId(id);
            res.status(200).json(deletedVoiture);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAllVoitures(req, res) {
        try {
            const voitures = await VoitureService.getAllVoitures();
            res.status(200).json(voitures);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addPhotoToVoiture(req, res) {
        const { voiture_id, photo_url } = req.body;
        try {
            const newPhoto = await VoitureService.addPhotoToVoiture(voiture_id, photo_url);
            res.status(201).json(newPhoto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = VoitureController;
