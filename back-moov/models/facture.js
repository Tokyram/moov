const db = require('../db');

class Facture {
    constructor(id, paiement_id, montant) {
        this.id = id;
        this.paiement_id = paiement_id;
        this.montant = montant;
    }

    static async create(factureData) {
        const query = `
            INSERT INTO facture (paiement_id, montant)
            VALUES ($1, $2)
            RETURNING *
        `;
        const values = [factureData.paiement_id, factureData.montant];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async getListeFacture() {
        const query = `
            SELECT 
                f.id AS facture_id,
                f.montant AS montant_facture,
                f.date_facture,
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.prix AS prix_course,
                c.kilometre,
                v.marque,
                v.modele,
                v.immatriculation
            FROM 
                facture f
                JOIN paiement p ON f.paiement_id = p.id
                JOIN course c ON p.course_id = c.id
                JOIN chauffeur_voiture cv ON c.chauffeur_id = cv.chauffeur_id
                JOIN voiture v ON cv.voiture_id = v.id
            ORDER BY 
                f.date_facture DESC;
        `;

        const result = await db.query(query);
        return result.rows;
    }

    static async getDetailFacture(factureId) {
        const query = `
            SELECT 
                f.id AS facture_id,
                f.montant AS montant_facture,
                f.date_facture,
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.prix AS prix_course,
                c.kilometre,
                v.marque,
                v.modele,
                v.immatriculation
            FROM 
                facture f
                JOIN paiement p ON f.paiement_id = p.id
                JOIN course c ON p.course_id = c.id
                JOIN chauffeur_voiture cv ON c.chauffeur_id = cv.chauffeur_id
                JOIN voiture v ON cv.voiture_id = v.id
            WHERE 
                f.id = $1;
        `;

        const result = await db.query(query, [factureId]);
        return result.rows[0];
    }
}

module.exports = Facture;
