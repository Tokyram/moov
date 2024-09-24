const TraitementCourseUtilisateur = require("../models/traitementCourseUtilisateur");

class TraitementCourseUtilisateurController {
    static async findTraitement(req, res) {
        const utilisateurId = req.params.utilisateurId;

        try {
            const enregistrement = await TraitementCourseUtilisateur.findTraitementCourse(utilisateurId);
            res.json({ enregistrement });
        } catch(error) {
            console.error('Controller Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = TraitementCourseUtilisateurController;
