const db = require("../db");


class Voiture {
    constructor(id, marque, modele, immatriculation) {
        this.id = id;
        this.marque = marque;
        this.modele = modele;
        this.immatriculation = immatriculation;
    }

    static async findAllCar() {
        let cars = [];

        const result = await db.query("SELECT * FROM voiture");

        for(const row of result.rows) {
            cars.push(
                new Voiture(
                    row.id,
                    row.marque,
                    row.modele,
                    row.immatriculation
                )
            );
        }

        return cars;
    }

    static async createVoiture(marque, modele, immatriculation) {
        try {
            const result = await db.query(
                `INSERT INTO voiture (marque, modele, immatriculation) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [marque, modele, immatriculation]
            );
            const voitureData = result.rows[0];
            return new Voiture(
                voitureData.id,
                voitureData.marque,
                voitureData.modele,
                voitureData.immatriculation
            );
        } catch (error) {
            throw new Error('Erreur lors de la création de la voiture : ' + error.message);
        }
    }

    static async getVoitureById(id) {
        try {
            const result = await db.query(
                `SELECT * FROM voiture WHERE id = $1`,
                [id]
            );
            if (result.rows.length === 0) {
                throw new Error('Voiture non trouvée');
            }
            const voitureData = result.rows[0];
            return new Voiture(
                voitureData.id,
                voitureData.marque,
                voitureData.modele,
                voitureData.immatriculation
            );
        } catch (error) {
            throw new Error('Erreur lors de la récupération de la voiture : ' + error.message);
        }
    }

    static async updateVoiture(id, marque, modele, immatriculation) {
        try {
            const result = await db.query(
                `UPDATE voiture
                 SET marque = $2, modele = $3, immatriculation = $4
                 WHERE id = $1
                 RETURNING *`,
                [id, marque, modele, immatriculation]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de la voiture : ' + error.message);
        }
    }

    static async getAllVoitures() {
        try {
            const result = await db.query(`SELECT * FROM voiture`);
            return result.rows.map(row => new Voiture(
                row.id,
                row.marque,
                row.modele,
                row.immatriculation
            ));
        } catch (error) {
            throw new Error('Erreur lors de la récupération des voitures : ' + error.message);
        }
    }

    static async deleteVoiture(id) {
        try {
            const result = await db.query(
                `DELETE FROM voiture WHERE id = $1 RETURNING *`,
                [id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la voiture : ' + error.message);
        }
    }

    toJSON() {
        return {
            id: this.id,
            marque: this.marque,
            modele: this.modele,
            immatriculation: this.immatriculation
        };
    }
}

module.exports = Voiture;