// const Panne = require('../models/panne');
const Panne = require('../models/panne');

const insertPanne = async (utilisateur_id, type_panne_id, commentaire) => {
    try {
        const newPanne = await Panne.insertPanne(utilisateur_id, type_panne_id, commentaire);
        return newPanne;
    } catch (error) {
        throw new Error('Erreur lors de l\'insertion du message de panne : ' + error.message);
    }
};

module.exports = {
    insertPanne
};