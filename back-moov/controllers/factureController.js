const Facture = require("../models/facture");


class FactureController {
    static async getListeFacture(req, res) {
        const facture = req.params.id
        try {
            const factures = await Facture.getListeFacture();
            res.json({
                success: true,
                data: factures
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getDetailFacture(req, res) {
        try {
            const { factureId } = req.params;
            const facture = await Facture.getDetailFacture(factureId);
            res.json({
                success: true,
                data: facture
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la facture :', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erreur serveur', 
                error: error.message 
            });
        }
    }
}

module.exports = FactureController;