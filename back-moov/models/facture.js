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
}

module.exports = Facture;
