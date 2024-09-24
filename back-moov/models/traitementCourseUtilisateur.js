const db = require('../db');

class TraitementCourseUtilisateur {

    static async enregistrementTraitementCourse(courseId, utilisateurId) {
        const query = `
            INSERT INTO traitement_course_utilisateur (course_id, utilisateur_id) VALUES ($1,$2)
            RETURNING *
        `;
        const result = await db.query(query, [courseId, utilisateurId]);
        return result.rows[0];
    }

    static async findTraitementCourse(utilisateurId) {
        const query = `
            SELECT * FROM traitement_course_utilisateur WHERE utilisateur_id = $1
        `;
        const result = await db.query(query, [utilisateurId]);
        return result.rows[0];
    }

    static async suppressionTraitementCourse(courseId) {
        const query = `
            DELETE FROM traitement_course_utilisateur WHERE course_id = $1
            RETURNING *
        `;
        const result = await db.query(query, [courseId]);
        return result.rows[0];
    }
}

module.exports = TraitementCourseUtilisateur