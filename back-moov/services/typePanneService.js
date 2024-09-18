const TypePanne = require('../models/typePanne');

const insertTypePanne = async (type) => {
    try {
        const newTypePanne = await TypePanne.insertType(type);
        return newTypePanne;
    } catch (error) {
        throw new Error('Erreur lors de l\'insertion du type de panne : ' + error.message);
    }
};

module.exports = {
    insertTypePanne
};
