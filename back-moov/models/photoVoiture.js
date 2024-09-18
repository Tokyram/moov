const db = require('../db'); 

class PhotoVoiture {
    constructor(id, voiture_id, photo_url) {
        this.id = id;
        this.voiture_id = voiture_id;
        this.photo_url = photo_url;
    }

    static async addPhoto(voiture_id, photo_url) {
        try {
            const result = await db.query(
                `INSERT INTO photo_voiture (voiture_id, photo_url) 
                 VALUES ($1, $2) 
                 RETURNING *`,
                [voiture_id, photo_url]
            );
            const photoData = result.rows[0];
            return new PhotoVoiture(
                photoData.id,
                photoData.voiture_id,
                photoData.photo_url
            );
        } catch (error) {
            throw new Error('Erreur lors de l\'ajout de la photo : ' + error.message);
        }
    }

    static async getPhotosByVoitureId(voiture_id) {
        try {
            const result = await db.query(
                `SELECT * FROM photo_voiture WHERE voiture_id = $1`,
                [voiture_id]
            );
            return result.rows.map(row => new PhotoVoiture(
                row.id,
                row.voiture_id,
                row.photo_url
            ));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des photos : ' + error.message);
        }
    }

    static async deletePhotosByVoitureId(id) {
        try {
            const result = await db.query(
                `DELETE FROM photo_voiture WHERE id = $1 RETURNING *`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la voiture : ' + error.message);
        }
    }
}

module.exports = PhotoVoiture;
