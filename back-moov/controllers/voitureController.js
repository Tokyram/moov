const Voiture = require("../models/voiture");


class VoitureController {
    static async listCars(req, res) {
        try {
            const cars = await Voiture.findAllCar();

            res.json({
                success: true,
                data: cars.map(car => car.toJSON()),
            })
        } catch(error) {
            console.error('Erreur lors de la récupération de la liste des voitures:', error);
            res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
        }
    }
}

module.exports = VoitureController;
