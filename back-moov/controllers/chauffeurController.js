const ChauffeurService = require('../services/chauffeurService');

class ChauffeurController {
    static async insertChauffeur(req, res) {
        const { nom, prenom, telephone, mail, mdp, adresse, photo } = req.body;

        try {
            const newChauffeur = await ChauffeurService.insertChauffeur({
                nom, prenom, telephone, mail, mdp, adresse, photo
            });
            res.status(201).json(newChauffeur);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ChauffeurController;
