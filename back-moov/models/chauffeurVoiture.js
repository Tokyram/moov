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

        const result = await db.query('INSERT INTO chauffeur_voiture (chauffeur_id, voiture_id, date_affectation) VALUES ($1, $2, $3) RETURNING *',
            [idChauffeur, idVoiture, new Date()]
        );

        return result;
    }

    static async listeAssignation() {
        let liste = [];

        const query = `
            SELECT 
                u.*,
                v.*,
                cv.date_affectation
            FROM 
                utilisateur u
            JOIN 
                chauffeur_voiture cv ON u.id = cv.chauffeur_id
            JOIN 
                voiture v ON cv.voiture_id = v.id
            ORDER BY 
                u.nom, u.prenom, cv.date_affectation DESC;
        `;

        const result = db.query(query);

        for(row of result.rows) {
            liste.push(row);
        }
        return liste;
    }
}

module.exports = ChauffeurVoiture;
