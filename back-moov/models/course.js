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

    static async findReservationAttente({skip = 0, limit = 10}) {
        let courses = [];

        const params = [skip, limit];

        const result = await db.query(
            `SELECT * FROM course WHERE status = 'EN ATTENTE' OFFSET $1 LIMIT $2`,
            params
        );

        for(const row of result.rows) {
            courses.push(
                new Course(
                    row.id,
                    row.passager_id,
                    row.chauffeur_id,
                    row.date_heure_depart,
                    {
                        longitude: row.adresse_depart_longitude,
                        latitude: row.adresse_depart_latitude,
                        adresse: row.adresse_depart
                    },
                    {
                        longitude: row.adresse_arrivee_longitude,
                        latitude: row.adresse_arrivee_latitude,
                        adresse: row.adresse_arrivee
                    },
                    row.status,
                    row.prix,
                    row.kilometre
                )
            )
        }

        return courses;
    }

    static async countReservationAttente() {
        
        const result = await db.query(
          `SELECT COUNT(*) FROM course WHERE status = 'EN ATTENTE'`
        );
      
        return parseInt(result.rows[0].count);
    }

    static async findConfirmationChauffeur(courseId, chauffeurId, status) {
        const result = await db.query(
            `SELECT COUNT(*) FROM confirmation_course_chauffeur WHERE course_id = $1 AND chauffeur_id = $2 AND status = $3`,
            [courseId, chauffeurId, status]
        );

        return parseInt(result.rows[0].count);
    }

    static async confirmationCourseChauffeur(courseId, chauffeurId, status) {
        const query = `INSERT INTO confirmation_course_chauffeur (course_id, chauffeur_id, status) VALUES ($1, $2, $3) RETURNING *`;
        const result = await db.query(query, [courseId, chauffeurId, status]);

        return result.rows[0];
    }

    static async getChauffeurAcceptes(courseId) {
        const query = `
            SELECT u.id, u.nom, u.prenom, u.telephone, v.marque, v.modele, v.immatriculation 
            FROM utilisateur u
            JOIN confirmation_course_chauffeur cc ON u.id = cc.chauffeur_id
            LEFT JOIN chauffeur_voiture cv ON u.id = cv.chauffeur_id
            LEFT JOIN voiture v on cv.voiture_id = v.id
            WHERE cc.course_id = $1 AND cc.status = 'ACCEPTE'
        `;
        const result = await db.query(query, [courseId]);
        return result.rows;
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

    static async attribuerChauffeur(courseId, chauffeurId) {
        const query = `
            UPDATE course 
            SET chauffeur_id = $1, status = 'ATTRIBUEE' 
            WHERE id = $2 AND status = 'EN ATTENTE'
            RETURNING *
        `;
        const result = await db.query(query, [chauffeurId, courseId]);
        return result.rows[0];
    }

    // services/courseService.js

    static async findCourseDetailsById(courseId, userId) {
        try {
            console.log('Requête SQL pour la course:', {
                courseId,
                userId
            });
    
            const result = await db.query(`
                SELECT 
                    course.id AS course_id,
                    course.date_heure_depart,
                    course.adresse_depart,
                    course.adresse_arrivee,
                    course.status AS status,
                    utilisateur_passager.id AS passager_id,
                    utilisateur_passager.nom AS passager_nom,
                    utilisateur_passager.mail AS passager_email,
                    utilisateur_passager.telephone AS passager_telephone,
                    utilisateur_chauffeur.id AS chauffeur_id,
                    utilisateur_chauffeur.nom AS chauffeur_nom,
                    utilisateur_chauffeur.mail AS chauffeur_email,
                    utilisateur_chauffeur.telephone AS chauffeur_telephone
                FROM course
                JOIN utilisateur AS utilisateur_passager ON course.passager_id = utilisateur_passager.id
                JOIN utilisateur AS utilisateur_chauffeur ON course.chauffeur_id = utilisateur_chauffeur.id
                WHERE course.id = $1
                AND (course.passager_id = $2 OR course.chauffeur_id = $2)
            `, [courseId, userId]);
    
            console.log('Résultats de la requête SQL:', result.rows);
    
            if (result.rows.length === 0) {
                console.log('Aucune course trouvée pour les paramètres spécifiés.');
            }
    
            return result.rows.map(row => new Course(...Object.values(row)));
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la course :', error.message);
            throw new Error('Erreur lors de la récupération des détails de la course : ' + error.message);
        }
    }

    static async listeReservationAttribuees(chauffeurId) {
        const query = `
            SELECT 
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.status,
                c.prix,
                c.kilometre,
                u_passager.id AS passager_id,
                u_passager.nom AS passager_nom,
                u_passager.prenom AS passager_prenom,
                u_passager.telephone AS passager_telephone,
                u_chauffeur.id AS chauffeur_id,
                u_chauffeur.nom AS chauffeur_nom,
                u_chauffeur.prenom AS chauffeur_prenom,
                u_chauffeur.telephone AS chauffeur_telephone,
                v.marque AS voiture_marque,
                v.modele AS voiture_modele,
                v.immatriculation AS voiture_immatriculation
            FROM course c
            JOIN utilisateur u_passager ON c.passager_id = u_passager.id
            JOIN utilisateur u_chauffeur ON c.chauffeur_id = u_chauffeur.id
            LEFT JOIN chauffeur_voiture cv ON u_chauffeur.id = cv.chauffeur_id
            LEFT JOIN voiture v ON cv.voiture_id = v.id
            WHERE c.chauffeur_id = $1 AND c.status = 'ATTRIBUE'
            ORDER BY c.date_heure_depart DESC
        `;
        const result = await db.query(query, [chauffeurId]);
        return result.rows;
    }

    static async calculateTotalDistanceByChauffeur(chauffeurId) {
        try {
            // Requête pour obtenir la somme des distances effectuées par le chauffeur
            const result = await db.query(`
                SELECT SUM(kilometre) AS total_distance
                FROM course
                WHERE chauffeur_id = $1 AND status = 'TERMINÉ'
            `, [chauffeurId]);

            // Si aucune course n'est trouvée, renvoyer une distance totale de 0
            const totalDistance = result.rows[0].total_distance || 0;

            return totalDistance;
        } catch (error) {
            throw new Error('Erreur lors du calcul de la distance totale : ' + error.message);
        }
    }

    static async calculateTotalDistanceByPassager(passagerId) {
        try {
            // Requête pour obtenir la somme des distances effectuées par le chauffeur
            const result = await db.query(`
                SELECT SUM(kilometre) AS total_distance
                FROM course
                WHERE passager_id = $1 AND status = 'TERMINÉ'
            `, [passagerId]);

            // Si aucune course n'est trouvée, renvoyer une distance totale de 0
            const totalDistance = result.rows[0].total_distance || 0;

            return totalDistance;
        } catch (error) {
            throw new Error('Erreur lors du calcul de la distance totale : ' + error.message);
        }
    }
    
    static async countReservationsByClient(clientId) {
        try {
            const result = await db.query(
                `SELECT COUNT(*) AS total_reservations
                    FROM course
                    WHERE passager_id = $1`,
                [clientId]
            );
            return result.rows[0].total_reservations;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du nombre de réservations : ' + error.message);
        }
    }

    static async countReservationsByChauffeur(chauffeurId) {
        try {
            const result = await db.query(
                `SELECT COUNT(*) AS total_reservations
                    FROM course
                    WHERE chauffeur_id = $1`,
                [chauffeurId]
            );
            return result.rows[0].total_reservations;
        } catch (error) {
            throw new Error('Erreur lors de la récupération du nombre de réservations : ' + error.message);
        }
    }
    
    static async commencerCourse(courseId) {
        const query = `
            UPDATE course 
            SET status = 'EN COURS' 
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [courseId]);
        return result.rows[0];
    }
}

module.exports = Course;