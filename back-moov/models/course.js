const db = require('../db');
const TraitementCourseUtilisateur = require('./traitementCourseUtilisateur');

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

        const addTraitement = await TraitementCourseUtilisateur.enregistrementTraitementCourse(result.rows[0].id, result.rows[0].passager_id);

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

    static async findReservationAttente({skip = 0, limit = 10, chauffeurId}) {
        let courses = [];

        const params = [chauffeurId, skip, limit];

        const result = await db.query(
            `SELECT c.* FROM course c
             LEFT JOIN confirmation_course_chauffeur ccc ON c.id = ccc.course_id AND ccc.chauffeur_id = $1
             WHERE c.status = 'EN ATTENTE' AND ccc.id IS NULL
             OFFSET $2 LIMIT $3`,
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

    static async countReservationAttente(chauffeurId) {
        const params = [chauffeurId];

        const result = await db.query(
            `SELECT COUNT(*) FROM course c
            LEFT JOIN confirmation_course_chauffeur ccc ON c.id = ccc.course_id AND ccc.chauffeur_id = $1
            WHERE c.status = 'EN ATTENTE' AND ccc.id IS NULL`,
            params
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
            SELECT u.id, u.nom, u.prenom, u.telephone, 
                   v.marque, v.modele, v.immatriculation,
                   pc.latitude, pc.longitude, pc.timestamp as position_timestamp
            FROM utilisateur u
            JOIN confirmation_course_chauffeur cc ON u.id = cc.chauffeur_id
            LEFT JOIN chauffeur_voiture cv ON u.id = cv.chauffeur_id
            LEFT JOIN voiture v ON cv.voiture_id = v.id
            LEFT JOIN position_chauffeur pc ON u.id = pc.chauffeur_id
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

    static async findCourseDetailsById(courseId) {
        try {
            console.log('Requête SQL pour la course:', {
                courseId
            });
    
            const result = await db.query(`
                SELECT 
                    c.id AS course_id,
                    c.date_heure_depart,
                    c.adresse_depart_longitude,
                    c.adresse_depart_latitude,
                    c.adresse_depart,
                    c.adresse_arrivee_longitude,
                    c.adresse_arrivee_latitude,
                    c.adresse_arrivee,
                    c.status AS course_status,
                    c.prix,
                    c.kilometre,
                    
                    -- Passager details
                    up.id AS passager_id,
                    up.nom AS passager_nom,
                    up.prenom AS passager_prenom,
                    up.telephone AS passager_telephone,
                    
                    -- Chauffeur details
                    uc.id AS chauffeur_id,
                    uc.nom AS chauffeur_nom,
                    uc.prenom AS chauffeur_prenom,
                    uc.telephone AS chauffeur_telephone,
                    
                    -- Voiture details
                    v.id AS voiture_id,
                    v.marque,
                    v.modele,
                    v.immatriculation,
                    
                    -- Photo voiture
                    v.photo_url AS voiture_photo
                FROM 
                    course c
                LEFT JOIN 
                    utilisateur up ON c.passager_id = up.id
                LEFT JOIN 
                    utilisateur uc ON c.chauffeur_id = uc.id
                LEFT JOIN 
                    chauffeur_voiture cv ON uc.id = cv.chauffeur_id
                LEFT JOIN 
                    voiture v ON cv.voiture_id = v.id
                WHERE 
                    c.id = $1
            `, [courseId]);
    
            if (result.rows.length === 0) {
                console.log('Aucune course trouvée pour les paramètres spécifiés.');
            }
    
            return result.rows[0];
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
                c.adresse_depart_longitude,
                c.adresse_depart_latitude,
                c.adresse_arrivee_longitude,
                c.adresse_arrivee_latitude,
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
            WHERE c.chauffeur_id = $1 AND c.status = 'ATTRIBUEE' OR c.status = 'EN COURS'
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
                WHERE chauffeur_id = $1 AND status = 'TERMINE'
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
                WHERE passager_id = $1 AND status = 'TERMINE'
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
        const addTraitement = await TraitementCourseUtilisateur.enregistrementTraitementCourse(result.rows[0].id, result.rows[0].passager_id);
        return result.rows[0];
    }

    static async terminerCourse(courseId) {
        const query = `
            UPDATE course 
            SET status = 'TERMINE' 
            WHERE id = $1
            RETURNING *
        `;
        const result = await db.query(query, [courseId]);
        const suppressionTraitement = TraitementCourseUtilisateur.suppressionTraitementCourse(result.rows[0].id);
        return result.rows[0];
    }

    static async getCourseCountByChauffeur(period) {
        try {
            const result = await db.query(
                `SELECT COUNT(*) as total_courses 
                 FROM course 
                 WHERE chauffeur_id = $1 
                 AND status = 'TERMINE'
                 AND created_at >= NOW() - INTERVAL '${period}'`,
                [period]
            );
            return result.rows[0].total_courses;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses : ' + error.message);
        }
    }

    static async getChauffeursWithCourseCount() {
        try {
            const result = await db.query(
                `SELECT u.id AS chauffeur_id, 
                        u.nom AS chauffeur_nom,
                        COUNT(c.id) AS total_courses 
                 FROM utilisateur u
                 LEFT JOIN course c ON u.id = c.chauffeur_id 
                 WHERE c.status = 'TERMINE'
                 GROUP BY u.id, u.nom`
            );
    
            return result.rows; // Retourne la liste des chauffeurs avec leur total de courses
        } catch (error) {
            throw new Error('Erreur lors de la récupération des chauffeurs : ' + error.message);
        }
    }
    

    static async getTotalCourses() {
        try {
            const result = await db.query(
                `SELECT COUNT(*) AS total_courses 
                 FROM course 
                 WHERE status = 'TERMINE'`
            );
            return result.rows[0].total_courses;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses : ' + error.message);
        }
    }


    static async getTotalCoursesByPeriod(periodType, year = new Date().getFullYear()) {
        try {
            let query;
    
            if (periodType === 'day') {
                query = `
                    SELECT DATE(date_heure_depart) AS date, COUNT(*) AS total_courses
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY DATE(date_heure_depart)
                    ORDER BY DATE(date_heure_depart) ASC
                `;
            } else if (periodType === 'week') {
                query = `
                    SELECT DATE_TRUNC('day', date_heure_depart) AS week, COUNT(*) AS total_courses
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY week
                    ORDER BY week ASC
                `;
            } else if (periodType === 'month') {
                query = `
                    SELECT DATE_TRUNC('week', date_heure_depart) AS month, COUNT(*) AS total_courses
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY month
                    ORDER BY month ASC
                `;
            } else if (periodType === 'year') {
                query = `
                    WITH RECURSIVE months AS (
                        SELECT DATE_TRUNC('month', TO_DATE($1 || '-01-01', 'YYYY-MM-DD')) AS month
                        UNION ALL
                        SELECT month + INTERVAL '1 month'
                        FROM months
                        WHERE month < DATE_TRUNC('month', TO_DATE($1 || '-12-01', 'YYYY-MM-DD'))
                    ),
                    course_counts AS (
                        SELECT DATE_TRUNC('month', date_heure_depart) AS month, COUNT(*) AS total_courses
                        FROM course
                        WHERE status = 'TERMINE'
                        AND EXTRACT(YEAR FROM date_heure_depart) = $1
                        GROUP BY DATE_TRUNC('month', date_heure_depart)
                    )
                    SELECT 
                        months.month,
                        COALESCE(course_counts.total_courses, 0) AS total_courses
                    FROM months
                    LEFT JOIN course_counts ON months.month = course_counts.month
                    ORDER BY months.month ASC
                `;
            } else {
                throw new Error('Type de période invalide');
            }
    
            const result = await db.query(query, [year]);
    
            // Parcourir les résultats et parser le champ 'total_courses'
            return result.rows.map(row => ({
                ...row,
                total_courses: parseInt(row.total_courses, 10) // Convertir total_courses en entier
            }));
    
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses : ' + error.message);
        }
    }

    static async getTotalRevenueByPeriod(periodType, year = new Date().getFullYear()) {
        try {
            let query;
    
            if (periodType === 'day') {
                query = `
                    SELECT DATE(date_heure_depart) AS date, SUM(prix) AS total_revenu
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY DATE(date_heure_depart)
                    ORDER BY DATE(date_heure_depart) ASC
                `;
            } else if (periodType === 'week') {
                query = `
                    SELECT DATE_TRUNC('day', date_heure_depart) AS week, SUM(prix) AS total_revenu
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY week
                    ORDER BY week ASC
                `;
            } else if (periodType === 'month') {
                query = `
                    SELECT DATE_TRUNC('week', date_heure_depart) AS month, SUM(prix) AS total_revenu
                    FROM course
                    WHERE status = 'TERMINE'
                    GROUP BY month
                    ORDER BY month ASC
                `;
            } else if (periodType === 'year') {
                query = `
                    WITH RECURSIVE months AS (
                    SELECT DATE_TRUNC('month', TO_DATE($1 || '-01-01', 'YYYY-MM-DD')) AS month
                    UNION ALL
                    SELECT month + INTERVAL '1 month'
                    FROM months
                    WHERE month < DATE_TRUNC('month', TO_DATE($1 || '-12-01', 'YYYY-MM-DD'))
                    ),
                    revenue_by_month AS (
                        SELECT 
                            DATE_TRUNC('month', date_heure_depart) AS month, 
                            SUM(prix) AS total_revenu
                        FROM course
                        WHERE status = 'TERMINE'
                        AND EXTRACT(YEAR FROM date_heure_depart) = $1
                        GROUP BY DATE_TRUNC('month', date_heure_depart)
                    )
                    SELECT 
                        months.month,
                        COALESCE(revenue_by_month.total_revenu, 0) AS total_revenu
                    FROM months
                    LEFT JOIN revenue_by_month ON months.month = revenue_by_month.month
                    ORDER BY months.month ASC
                `;
            } else {
                throw new Error('Type de période invalide');
            }
    
            const result = await db.query(query, [year]);
    
            return result.rows.map(row => ({
                ...row,
                total_revenue: parseInt(row.total_revenu)
            }));
    
        } catch (error) {
            throw new Error('Erreur lors de la récupération des courses : ' + error.message);
        }
    }
    

    static async listeReservationAttribueesUser(userId) {
        const query = `
            SELECT 
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.adresse_depart_longitude,
                c.adresse_depart_latitude,
                c.adresse_arrivee_longitude,
                c.adresse_arrivee_latitude,
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
            WHERE c.passager_id = $1 AND c.status = 'ATTRIBUEE' OR c.status = 'EN COURS'
            ORDER BY c.date_heure_depart DESC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    static async suppressionCourseChauffeur(courseId) {
        const query = `DELETE FROM confirmation_course_chauffeur WHERE course_id = $1 RETURNING *`;
        const result = await db.query(query, [courseId]);

        return result.rows[0];
    }

    static async historiqueReservationChauffeur(userId) {
        const query = `
            SELECT 
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.adresse_depart_longitude,
                c.adresse_depart_latitude,
                c.adresse_arrivee_longitude,
                c.adresse_arrivee_latitude,
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
            WHERE c.chauffeur_id = $1 AND c.status = 'TERMINE'
            ORDER BY c.date_heure_depart DESC
        `;
        const result = await db.query(query, [userId]);
        return result.rows;
    }

    static async historiqueReservationUser(chauffeurId) {
        const query = `
            SELECT 
                c.id AS course_id,
                c.date_heure_depart,
                c.adresse_depart,
                c.adresse_arrivee,
                c.adresse_depart_longitude,
                c.adresse_depart_latitude,
                c.adresse_arrivee_longitude,
                c.adresse_arrivee_latitude,
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
            WHERE c.passager_id = $1 AND c.status = 'TERMINE'
            ORDER BY c.date_heure_depart DESC
        `;
        const result = await db.query(query, [chauffeurId]);
        return result.rows;
    }

    static async getTotalRevenue() {
        try {
          const result = await db.query(`SELECT SUM(prix) AS total_revenue FROM course WHERE status = 'TERMINE'`);
          return result.rows[0].total_revenue;
        } catch (err) {
          throw new Error('Erreur lors de la récupération du total des revenus : ' + err.message);
        }
      };


}



module.exports = Course;