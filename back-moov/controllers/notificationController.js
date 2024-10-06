// /controllers/notificationController.js
const Notification = require("../models/notification");
const firebaseService = require("../services/firebaseService");

exports.sendPushNotification = async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const result = await firebaseService.sendNotification(token, title, body);
    res.status(200).send("Notification envoyée avec succès : " + result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.countNotificationNonLu = async (req, res) => {
  const user_id = req.params.userId;
  try {
    const result = await Notification.countNonLuNotification(user_id);
    res.status(200).json({ success: true, message: 'Notifications non lus', data: result });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de notifications non lus:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};