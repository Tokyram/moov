const Chauffeur = require('../models/chauffeur');

const insertChauffeur = async (chauffeurData) => {
    try {
        const { nom, prenom, telephone, mail, mdp, adresse, photo } = chauffeurData;
        const newChauffeur = await Chauffeur.insertChauffeur(
            nom,
            prenom,
            telephone,
            mail,
            mdp,
            adresse,
            photo
        );
        return newChauffeur;
    } catch (error) {
        throw new Error('Erreur lors de l\'insertion du chauffeur : ' + error.message);
    }
};

module.exports = {
    insertChauffeur
};
