// controllers/avisController.js
const AvisService = require('../services/avis_service');
const Notification = require('../models/notification');
const TokenDeviceUser = require('../models/tokenDeviceUser');
const firebaseService = require("../services/firebaseService");

class AvisController {
    static async createAvis(req, res) {
        const { passagerId, chauffeurId, etoiles, commentaire, courseId, auteur } = req.body;

        const notificationTitle = 'Avis sur votre qualité de service';
        const notificationBody = 'Un avis vous a été attribué selon votre qualité de service !';

        try {
            const avis = await AvisService.createAvis(passagerId, chauffeurId, etoiles, commentaire, courseId, auteur);
            if(auteur === "chauffeur") {
                const notif = await Notification.createNotification({utilisateur_id: chauffeurId, contenu: notificationBody, type_notif: 'AVIS', entity_id: courseId});
                const tokenNotif = await TokenDeviceUser.findToken(chauffeurId);
                const sendNotif = await firebaseService.sendNotification(tokenNotif.token_device, notificationTitle, notificationBody);
            } else {
                const notif = await Notification.createNotification({utilisateur_id: passagerId, contenu: notificationBody, type_notif: 'AVIS', entity_id: courseId});
                const tokenNotif = await TokenDeviceUser.findToken(passagerId);
                const sendNotif = await firebaseService.sendNotification(tokenNotif.token_device, notificationTitle, notificationBody);
            }
            res.status(201).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByChauffeur(req, res) {
        const { chauffeurId } = req.params;

        try {
            const avis = await AvisService.getAvisByChauffeur(chauffeurId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByPassager(req, res) {
        const { passagerId } = req.params;

        try {
            const avis = await AvisService.getAvisByPassager(passagerId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAvisByCourse(req, res) {
        const { courseId } = req.params;

        try {
            const avis = await AvisService.getAvisByCourse(courseId);
            res.status(200).json(avis);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AvisController;
