
const ChauffeurVoiture = require('../models/chauffeurVoiture');

class ChauffeurVoitureController {
    static async assignationVoitureChauffeur(req, res) {
        const {idChauffeur, idVoiture} = req.body;
        try {

            const findCarDriver = await ChauffeurVoiture.findCarDriver(idChauffeur, idVoiture);

            if(!findCarDriver) {
                const ass = await ChauffeurVoiture.assignationCarDriver(idChauffeur, idVoiture);
                res.json({message: 'Assignation effectuée', data: ass});
            } else {
                res.status(400).json({ message: 'Voiture et/ou chauffeur déjà assigné!'});
            }
            
        } catch(error) {
            console.error('Erreur :', error);
            res.status(500).json({ message: 'Erreur', error: error.message });
        }
    }
}

module.exports = ChauffeurVoitureController;
