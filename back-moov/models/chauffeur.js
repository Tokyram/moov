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
}

module.exports = Chauffeur;
