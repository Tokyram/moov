const db = require('../db');

class Course {
    constructor(id, passager_id, chauffeur_id, date_heure_depart, adresse_depart, adresse_arrivee, status, prix, kilometre) {
        this.id = id;
        this.passager_id = passager_id;
        this.chauffeur_id = chauffeur_id;
        this.date_heure_depart = date_heure_depart;
        this.adresse_depart = adresse_depart;
        this.adresse_arrivee = adresse_arrivee;
        this.status = status;
        this.prix = prix;
        this.kilometre = kilometre;
    }

    static async reserver(courseData) {
        const query = `
            INSERT INTO course (
                passager_id, chauffeur_id, date_heure_depart,
                adresse_depart_longitude, adresse_depart_latitude, adresse_depart,
                adresse_arrivee_longitude, adresse_arrivee_latitude, adresse_arrivee,
                prix, kilometre, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `;

        const values = [
            courseData.passager_id,
            courseData.chauffeur_id,
            courseData.date_heure_depart,
            courseData.adresse_depart.longitude,
            courseData.adresse_depart.latitude,
            courseData.adresse_depart.adresse,
            courseData.adresse_arrivee.longitude,
            courseData.adresse_arrivee.latitude,
            courseData.adresse_arrivee.adresse,
            courseData.prix,
            courseData.kilometre,
            'EN ATTENTE' // statut par défaut lors de la réservation
        ];

        const result = await db.query(query, values);
        return new Course(
            result.rows[0].id,
            result.rows[0].passager_id,
            result.rows[0].chauffeur_id,
            result.rows[0].date_heure_depart,
            {
                longitude: result.rows[0].adresse_depart_longitude,
                latitude: result.rows[0].adresse_depart_latitude,
                adresse: result.rows[0].adresse_depart
            },
            {
                longitude: result.rows[0].adresse_arrivee_longitude,
                latitude: result.rows[0].adresse_arrivee_latitude,
                adresse: result.rows[0].adresse_arrivee
            },
            result.rows[0].status,
            result.rows[0].prix,
            result.rows[0].kilometre
        );
    }

    toJSON() {
        return {
            id: this.id,
            passager_id: this.passager_id,
            chauffeur_id: this.chauffeur_id,
            date_heure_depart: this.date_heure_depart,
            adresse_depart: this.adresse_depart,
            adresse_arrivee: this.adresse_arrivee,
            status: this.status,
            prix: this.prix,
            kilometre: this.kilometre
        };
    }
}

module.exports = Course;