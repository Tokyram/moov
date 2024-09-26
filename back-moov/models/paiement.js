const db = require('../db');


class Paiement {
    constructor(id, course_id, montant, status, stripe_payment_intent_id) {
        this.id = id;
        this.course_id = course_id;
        this.montant = montant;
        this.status = status;
        this.stripe_payment_intent_id = stripe_payment_intent_id;
    }

    static async create(paiementData) {
        const query = `
            INSERT INTO paiement (course_id, montant, status, stripe_payment_intent_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [paiementData.course_id, paiementData.montant, paiementData.status, paiementData.stripe_payment_id];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = Paiement;
