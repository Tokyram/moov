const db = require('../db'); // Connexion à la base de données

class Panne {
    constructor(id, utilisateur_id, type_panne_id, commentaire, date_signalement) {
        this.id = id;
        this.utilisateur_id = utilisateur_id;
        this.type_panne_id = type_panne_id;
        this.commentaire = commentaire;
        this.date_signalement = date_signalement;
    }

    static async insertPanne(utilisateur_id, type_panne_id, commentaire) {
        try {
            const result = await db.query(
                `INSERT INTO panne (utilisateur_id, type_panne_id, commentaire) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [utilisateur_id, type_panne_id, commentaire || null]
            );
            const panneData = result.rows[0];
            return new Panne(
                panneData.id,
                panneData.utilisateur_id,
                panneData.type_panne_id,
                panneData.commentaire,
                panneData.date_signalement
            );
        } catch (error) {
            throw new Error('Erreur lors de l\'insertion du message de panne : ' + error.message);
        }
    }
}

module.exports = Panne;
