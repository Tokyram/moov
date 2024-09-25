const Tarifs = require("../models/tarifs");

class TarifsController {
    static async getTarif(req, res) {
        try {
            const tarif = await Tarifs.getTarifs();
            res.status(200).json({ tarif: tarif });
        } catch(error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TarifsController;
