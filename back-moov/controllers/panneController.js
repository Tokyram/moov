const PanneService = require('../services/panneService');
const TypePanne = require('../models/typePanne');
const TypePanneService = require('../services/typePanneService');
const Panne = require('../models/panne');

class PanneController {
    static async insertPanne(req, res) {
        const { utilisateur_id, type_panne_id, commentaire } = req.body;

        try {
            const newPanne = await PanneService.insertPanne(utilisateur_id, type_panne_id, commentaire);
            res.status(201).json(newPanne);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTypes(req, res) {
        try {
            const types = await TypePanne.getAllTypes();
            res.status(200).json(types);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async insertTypePanne(req, res) {
        const { type } = req.body;

        try {
            const newTypePanne = await TypePanneService.insertTypePanne(type);
            res.status(201).json(newTypePanne);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getListePannes(req, res) {
        try {
            const pannes = await Panne.getListePanne();
            res.json({
                success: true,
                data: pannes
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async resoudrePanne(req, res) {
        const panne_id = req.params.panneId;
        try {
            const panne = await Panne.resoudrePanne(panne_id);
            res.json({
                success: true,
                data: panne
            })
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = PanneController;
