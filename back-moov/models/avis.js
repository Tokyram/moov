const db = require('../db');

class Avis {
    constructor(id, passager_id, chauffeur_id, etoiles, commentaire, date, course_id, auteur) {
        this.id = id;
        this.passager_id = passager_id;
        this.chauffeur_id = chauffeur_id;
        this.etoiles = etoiles;
        this.commentaire = commentaire;
        this.date = date;
        this.course_id = course_id;
        this.auteur = auteur; // Définit si l'avis vient du passager ou du chauffeur
    }

    // Créer un avis
    static async createAvis(passagerId, chauffeurId, etoiles, commentaire, courseId, auteur) {
        try {
            const result = await db.query(
                'INSERT INTO avis (passager_id, chauffeur_id, etoiles, commentaire, date, course_id, auteur) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [passagerId, chauffeurId, etoiles, commentaire, new Date(), courseId, auteur]
            );
            return new Avis(...Object.values(result.rows[0]));
        } catch (error) {
            throw new Error('Erreur lors de la création de l\'avis : ' + error.message);
        }
    }

    // Récupérer les avis pour un chauffeur
    static async getAvisByChauffeur(chauffeurId) {
        try {
            const result = await db.query(
                'SELECT * FROM avis WHERE chauffeur_id = $1 AND auteur = $2',
                [chauffeurId, 'passager'] // Récupérer uniquement les avis laissés par des passagers
            );
            return result.rows.map(row => new Avis(...Object.values(row)));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour le chauffeur : ' + error.message);
        }
    }

    // Récupérer les avis pour un passager
    static async getAvisByPassager(passagerId) {
        try {
            const result = await db.query(
                'SELECT * FROM avis WHERE passager_id = $1 AND auteur = $2',
                [passagerId, 'chauffeur'] // Récupérer uniquement les avis laissés par des chauffeurs
            );
            return result.rows.map(row => new Avis(...Object.values(row)));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour le passager : ' + error.message);
        }
    }

    // Récupérer les avis pour une course spécifique
    static async getAvisByCourse(courseId) {
        try {
            const result = await db.query(
                'SELECT * FROM avis WHERE course_id = $1',
                [courseId]
            );
            return result.rows.map(row => new Avis(...Object.values(row)));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des avis pour la course : ' + error.message);
        }
    }

    static async getMoyenneAvisPassager(passagerId) {
        try {
            const query = `
                SELECT ROUND(AVG(etoiles)) AS moyenne_etoiles_passager
                FROM avis
                WHERE passager_id = $1
                AND auteur = 'chauffeur';

            `;
            const result = await db.query(query, [passagerId]);
            return result.rows[0];
        } catch(error) {
            throw new Error('Erreur lors de la récupération de la moyenne des avis : ' + error.message);
        }
    }

    static async getMoyenneAvisChauffeur(chauffeurId) {
        try {
            const query = `
                SELECT ROUND(AVG(etoiles)) AS moyenne_etoiles_chauffeur
                FROM avis
                WHERE chauffeur_id = $1
                AND auteur = 'passager';

            `;
            const result = await db.query(query, [chauffeurId]);
            return result.rows[0];
        } catch(error) {
            throw new Error('Erreur lors de la récupération de la moyenne des avis : ' + error.message);
        }
    }
}

module.exports = Avis;
