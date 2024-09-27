// services/voitureService.js
const Voiture = require('../models/voiture');
// const PhotoVoiture = require('../models/photoVoiture');

const createVoiture = async (voitureData) => {
    try {
        return await Voiture.createVoiture(
            voitureData.marque,
            voitureData.modele,
            voitureData.immatriculation,
            voitureData.photo_url
        );
    } catch (error) {
        throw new Error('Erreur lors de la création de la voiture : ' + error.message);
    }
};

const getVoitureById = async (id) => {
    try {
        const voiture = await Voiture.getVoitureById(id);
        // const photos = await PhotoVoiture.getPhotosByVoitureId(id);
        return { ...voiture };
    } catch (error) {
        throw new Error('Erreur lors de la récupération de la voiture : ' + error.message);
    }
};



const updateVoiture = async (id, voitureData) => {
    try {
        return await Voiture.updateVoiture(
            id,
            voitureData.marque,
            voitureData.modele,
            voitureData.immatriculation,
            voitureData.photo_url
        );
    } catch (error) {
        throw new Error('Erreur lors de la mise à jour de la voiture : ' + error.message);
    }
};

// const deletePhotosByVoitureId = async (id) => {
//     try {
//         await PhotoVoiture.deletePhotosByVoitureId(id); // Assurez-vous de supprimer les photos liées
//         return await Voiture.deleteVoiture(id);
//     } catch (error) {
//         throw new Error('Erreur lors de la suppression de la voiture : ' + error.message);
//     }
// };

const deleteVoiture = async (id) => {
    try {
        const deletedVoiture = await Voiture.deleteVoiture(id);
        return deletedVoiture;
    } catch (error) {
        throw new Error('Erreur lors de la suppression de la voiture : ' + error.message);
    }
}

const getAllVoitures = async () => {
    try {
        return await Voiture.getAllVoitures();
    } catch (error) {
        throw new Error('Erreur lors de la récupération des voitures : ' + error.message);
    }
};

// const addPhotoToVoiture = async (voiture_id, photo_url) => {
//     try {
//         return await PhotoVoiture.addPhoto(voiture_id, photo_url);
//     } catch (error) {
//         throw new Error('Erreur lors de l\'ajout de la photo : ' + error.message);
//     }
// };

module.exports = {
    createVoiture,
    getVoitureById,
    updateVoiture,
    deleteVoiture,
    getAllVoitures,
    // addPhotoToVoiture,
    // deletePhotosByVoitureId
};
