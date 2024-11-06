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

    static async getListePanne() {
        const query = `
        SELECT 
            p.id AS panne_id,
            p.commentaire,
            p.date_signalement,
            p.resolu,
            tp.type AS type_panne,
            u.id AS utilisateur_id,
            u.nom,
            u.prenom,
            u.telephone,
            u.mail,
            u.adresse,
            pc.latitude,
            pc.longitude,
            pc.timestamp AS derniere_position
        FROM panne p
        INNER JOIN type_panne tp ON p.type_panne_id = tp.id
        INNER JOIN utilisateur u ON p.utilisateur_id = u.id
        LEFT JOIN position_chauffeur pc ON u.id = pc.chauffeur_id
        ORDER BY p.date_signalement DESC;
        `;

        const result = await db.query(query);
        return result.rows;

    }

    static async resoudrePanne(panne_id) {
        const query = `
            UPDATE panne set resolu = true WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [panne_id]);
        return result.rows[0];
    }
}

module.exports = Panne;
