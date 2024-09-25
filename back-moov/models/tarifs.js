const db = require("../db");


class Tarifs {
    static async getTarifs() {
        try {
            const result = await db.query('SELECT tarif_par_km FROM tarifs');
            return result.rows[0].tarif_par_km;
        } catch(error) {
            throw new Error('Erreur lors de la récupération du tarif : ' + error.message);
        }
    }
}

module.exports = Tarifs;