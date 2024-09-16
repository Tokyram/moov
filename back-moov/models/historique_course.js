const db = require('../db');

class Course {
    constructor(id, passager_id, chauffeur_id, date_heure_depart, adresse_depart_longitude, adresse_depart_latitude, adresse_depart, adresse_arrivee_longitude, adresse_arrivee_latitude, adresse_arrivee, status, prix, kilometre, created_at) {
        this.id = id;
        this.passager_id = passager_id;
        this.chauffeur_id = chauffeur_id;
        this.date_heure_depart = date_heure_depart;
        this.adresse_depart_longitude = adresse_depart_longitude;
        this.adresse_depart_latitude = adresse_depart_latitude;
        this.adresse_depart = adresse_depart;
        this.adresse_arrivee_longitude = adresse_arrivee_longitude;
        this.adresse_arrivee_latitude = adresse_arrivee_latitude;
        this.adresse_arrivee = adresse_arrivee;
        this.status = status;
        this.prix = prix;
        this.kilometre = kilometre;
        this.created_at = created_at;
    }

    static async findCompletedCoursesByPassager(passagerId) {
        try {
            const result = await db.query(
                `SELECT * FROM course WHERE passager_id = $1 AND status = 'TERMINÉ'`,
                [passagerId]
            );
            return result.rows.map(row => new Course(...Object.values(row)));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses terminées : ' + error.message);
        }
    }
}

module.exports = Course;
