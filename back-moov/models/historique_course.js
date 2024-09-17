const db = require('../db');

class Course {
    constructor(
        id, passager_id, chauffeur_id,
        date_heure_depart, adresse_depart_longitude, adresse_depart_latitude, adresse_depart,
        adresse_arrivee_longitude, adresse_arrivee_latitude, adresse_arrivee,
        status, prix, kilometre, created_at,
        passager_nom, passager_email, passager_telephone,
        chauffeur_nom, chauffeur_email, chauffeur_telephone
    ) {
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
        this.passager = {
            nom: passager_nom,
            email: passager_email,
            telephone: passager_telephone
        };
        this.chauffeur = {
            nom: chauffeur_nom,
            email: chauffeur_email,
            telephone: chauffeur_telephone
        };
    }

    static async findCompletedCoursesByPassager(passagerId) {
        try {
            const result = await db.query(`
                SELECT 
                    course.id AS course_id,
                    course.date_heure_depart,
                    course.adresse_depart_longitude,
                    course.adresse_depart_latitude,
                    course.adresse_depart,
                    course.adresse_arrivee_longitude,
                    course.adresse_arrivee_latitude,
                    course.adresse_arrivee,
                    course.status,
                    course.prix,
                    course.kilometre,
                    course.created_at,
                    utilisateur_passager.nom AS passager_nom,
                    utilisateur_passager.mail AS passager_email,
                    utilisateur_passager.telephone AS passager_telephone,
                    utilisateur_chauffeur.nom AS chauffeur_nom,
                    utilisateur_chauffeur.mail AS chauffeur_email,
                    utilisateur_chauffeur.telephone AS chauffeur_telephone
                FROM course
                JOIN utilisateur AS utilisateur_passager ON course.passager_id = utilisateur_passager.id
                JOIN utilisateur AS utilisateur_chauffeur ON course.chauffeur_id = utilisateur_chauffeur.id
                WHERE course.passager_id = $1 AND course.status = 'TERMINÉ'
            `, [passagerId]);

            return result.rows.map(row => new Course(
                row.course_id,
                row.passager_id,
                row.chauffeur_id,
                row.date_heure_depart,
                row.adresse_depart_longitude,
                row.adresse_depart_latitude,
                row.adresse_depart,
                row.adresse_arrivee_longitude,
                row.adresse_arrivee_latitude,
                row.adresse_arrivee,
                row.status,
                row.prix,
                row.kilometre,
                row.created_at,
                row.passager_nom,
                row.passager_email,
                row.passager_telephone,
                row.chauffeur_nom,
                row.chauffeur_email,
                row.chauffeur_telephone
            ));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses terminées : ' + error.message);
        }
    }

    static async findCompletedCoursesByChauffeur(chauffeurId) {
        try {
            const result = await db.query(`
                SELECT 
                    course.id AS course_id,
                    course.date_heure_depart,
                    course.adresse_depart_longitude,
                    course.adresse_depart_latitude,
                    course.adresse_depart,
                    course.adresse_arrivee_longitude,
                    course.adresse_arrivee_latitude,
                    course.adresse_arrivee,
                    course.status,
                    course.prix,
                    course.kilometre,
                    course.created_at,
                    utilisateur_passager.nom AS passager_nom,
                    utilisateur_passager.mail AS passager_email,
                    utilisateur_passager.telephone AS passager_telephone,
                    utilisateur_chauffeur.nom AS chauffeur_nom,
                    utilisateur_chauffeur.mail AS chauffeur_email,
                    utilisateur_chauffeur.telephone AS chauffeur_telephone
                FROM course
                JOIN utilisateur AS utilisateur_passager ON course.passager_id = utilisateur_passager.id
                JOIN utilisateur AS utilisateur_chauffeur ON course.chauffeur_id = utilisateur_chauffeur.id
                WHERE course.chauffeur_id = $1 AND course.status = 'TERMINÉ'
            `, [chauffeurId]);

            return result.rows.map(row => new Course(
                row.course_id,
                row.passager_id,
                row.chauffeur_id,
                row.date_heure_depart,
                row.adresse_depart_longitude,
                row.adresse_depart_latitude,
                row.adresse_depart,
                row.adresse_arrivee_longitude,
                row.adresse_arrivee_latitude,
                row.adresse_arrivee,
                row.status,
                row.prix,
                row.kilometre,
                row.created_at,
                row.passager_nom,
                row.passager_email,
                row.passager_telephone,
                row.chauffeur_nom,
                row.chauffeur_email,
                row.chauffeur_telephone
            ));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses terminées pour le chauffeur : ' + error.message);
        }
    }


    static async findCourseById(courseId) {
        try {
            const result = await db.query('SELECT * FROM course WHERE id = $1', [courseId]);
            if (result.rows.length > 0) {
                return new Course(...Object.values(result.rows[0]));
            }
            return null;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des détails de la course : ' + error.message);
        }
    }
}

module.exports = Course;
