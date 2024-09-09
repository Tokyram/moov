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