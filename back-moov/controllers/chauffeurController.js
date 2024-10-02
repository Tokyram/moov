const Chauffeur = require('../models/chauffeur');
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

    static async updatePosition(req, res) {
        const { latitude, longitude } = req.body;
        const chauffeurId = req.user.id;
    
        try {
          // Validation des données
          if (!latitude || !longitude) {
            return res.status(400).json({ message: "Données manquantes" });
          }
    
          // Validation des coordonnées
          Chauffeur.validateCoordinates(latitude, longitude);
    
          // Mise à jour de la position
          await Chauffeur.upsert(chauffeurId, latitude, longitude);
    
          res.status(200).json({ message: "Position mise à jour avec succès" });
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la position:', error);
          if (error.message === "Coordonnées invalides") {
            res.status(400).json({ message: error.message });
          } else {
            res.status(500).json({ message: "Erreur lors de la mise à jour de la position" });
          }
        }
    }

    static async getKilometresByChauffeur(req, res) {
      const chauffeur_id = req.params.chauffeur_id
      try {
          const chauffeurKilometre = await Chauffeur.getKilometresByChauffeur(chauffeur_id);
          res.json({
              success: true,
              data: chauffeurKilometre
          });
      } catch (error) {
          res.status(500).json({ error: error.message });
      }
  }
}

module.exports = ChauffeurController;
