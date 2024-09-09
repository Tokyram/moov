const db = require("../db");

class ChauffeurVoiture {
    constructor(id, chauffeur_id, voiture_id, date_affectation) {
        this.id = id;
        this.chauffeur_id = chauffeur_id;
        this.voiture_id = voiture_id;
        this.date_affectation = date_affectation
    }

    static async findCarDriver(idChauffeur, idVoiture) {
        const result = await db.query('SELECT COUNT(id) FROM chauffeur_voiture WHERE chauffeur_id = $1 OR voiture_id = $2', [idChauffeur, idVoiture]);

        if(parseInt(result.rows[0].count) > 0) {
            return true;
        }

        return false;
    }

    static async assignationCarDriver(idChauffeur, idVoiture) {

        const result = await db.query('INSERT INTO chauffeur_voiture (chauffeur_id, voiture_id) VALUES ($1, $2) RETURNING *',
            [idChauffeur, idVoiture]
        );

        return result;
    }
}

module.exports = ChauffeurVoiture;
