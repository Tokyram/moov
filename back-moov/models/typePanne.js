const db = require('../db'); // Connexion à la base de données

class TypePanne {
    static async getAllTypes() {
        try {
            const result = await db.query('SELECT * FROM type_panne');
            return result.rows;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des types de panne : ' + error.message);
        }
    }

    static async insertType(type) {
        try {
            const result = await db.query(
                `INSERT INTO type_panne (type) 
                 VALUES ($1) 
                 RETURNING *`,
                [type]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Erreur lors de l\'insertion du type de panne : ' + error.message);
        }
    }
}

module.exports = TypePanne;
