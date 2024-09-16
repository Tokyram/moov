const db = require('../db');

class Facture {
    constructor(id, paiement_id, montant, stripe_invoice_id, stripe_invoice_url) {
        this.id = id;
        this.paiement_id = paiement_id;
        this.montant = montant;
        this.stripe_invoice_id = stripe_invoice_id;
        this.stripe_invoice_url = stripe_invoice_url;
    }

    static async create(factureData) {
        const query = `
            INSERT INTO facture (paiement_id, montant, stripe_invoice_id, stripe_invoice_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [factureData.paiement_id, factureData.montant, factureData.stripe_invoice_id, factureData.stripe_invoice_url];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Facture;
