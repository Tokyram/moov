// controllers/voitureController.js
const Voiture = require('../models/voiture');
const VoitureService = require('../services/voitureService');
const fs = require('fs');

class VoitureController {
    static async createVoiture(req, res) {
        const { marque, modele, immatriculation,photo_url } = req.body;
        try {

            let photoPath = '';
            let originalPath = '';
            if (req.file) {
                originalPath = req.file.path;
                photoPath = originalPath.replace('uploads/', '');
                console.log("photo", photoPath);
            }

            const newVoiture = await VoitureService.createVoiture({ marque, modele, immatriculation, photo_url: photoPath });
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
            const voiture = await Voiture.getVoitureById(id);

            if (!voiture) {
                return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
            }

            let photoPath = voiture.photo_url;
            let originalPath = '';
            if (req.file) {
                originalPath = req.file.path;
                photoPath = originalPath.replace('uploads/', '');
                console.log("photo", photoPath);
                if (voiture.photo_url) {
                    fs.unlink(voiture.photo_url, (err) => {
                        if (err) console.error('Erreur lors de la suppression de l\'ancienne photo:', err);
                    });
                }
            }

            const updatedVoiture = await VoitureService.updateVoiture(id, { marque, modele, immatriculation, photo_url: photoPath });
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


    static async getAllVoitures(req, res) {
        try {
            const voitures = await VoitureService.getAllVoitures();
            res.status(200).json(voitures);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = VoitureController;
