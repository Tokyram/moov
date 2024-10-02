const db = require('../db'); // Connexion à la base de données

// models/Chauffeur.js

class Chauffeur {
    constructor(id, nom, prenom, telephone, mail, mdp, adresse, photo, role = 'CHAUFFEUR', date_inscription, est_banni = false, date_banni = null) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.mail = mail;
        this.mdp = mdp;
        this.adresse = adresse;
        this.photo = photo;
        this.role = role;
        this.date_inscription = date_inscription;
        this.est_banni = est_banni;
        this.date_banni = date_banni;
    }

    static async insertChauffeur(nom, prenom, telephone, mail, mdp, adresse, photo) {
        try {
            const result = await db.query(
                `INSERT INTO utilisateur (nom, prenom, telephone, mail, mdp, adresse, photo, role, est_banni) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'CHAUFFEUR', false) 
                 RETURNING id, nom, prenom, telephone, mail, mdp, adresse, photo, role, date_inscription, est_banni, date_banni`,
                [nom, prenom, telephone, mail, mdp, adresse, photo]
            );

            const chauffeurData = result.rows[0];
            
            // Créer un nouvel objet Chauffeur avec les données insérées
            return new Chauffeur(
                chauffeurData.id,
                chauffeurData.nom,
                chauffeurData.prenom,
                chauffeurData.telephone,
                chauffeurData.mail,
                chauffeurData.mdp,
                chauffeurData.adresse,
                chauffeurData.photo,
                chauffeurData.role,
                chauffeurData.date_inscription,
                chauffeurData.est_banni,
                chauffeurData.date_banni
            );
        } catch (error) {
            throw new Error('Erreur lors de l\'insertion du chauffeur : ' + error.message);
        }
    }

    static async upsert(chauffeurId, latitude, longitude) {
        const query = 'SELECT upsert_position_chauffeur($1, $2, $3)';
        await db.query(query, [chauffeurId, latitude, longitude]);
    }

    static validateCoordinates(latitude, longitude) {
        if (isNaN(latitude) || isNaN(longitude) || 
            latitude < -90 || latitude > 90 || 
            longitude < -180 || longitude > 180) {
          throw new Error("Coordonnées invalides");
        }
    }

    static async getKilometresByChauffeur(chauffeur_id) {
        const query = `
            SELECT 
                chauffeur_id, 
                SUM(kilometre) AS total_kilometres
            FROM 
                course
            WHERE 
                chauffeur_id = $1
            GROUP BY 
                chauffeur_id;
        `;

        const result = await db.query(query, [chauffeur_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }

    static async getKilometresByPassager(passager_id) {
        const query = `
            SELECT 
                passager_id, 
                SUM(kilometre) AS total_kilometres
            FROM 
                course
            WHERE 
                passager_id = $1
            GROUP BY 
                passager_id;
        `;

        const result = await db.query(query, [passager_id]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0];
    }
}

module.exports = Chauffeur;
