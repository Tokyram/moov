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
  console.log("user", user_id);
  try {
    const result = await Notification.countNonLuNotification(user_id);
    res.status(200).json({ success: true, message: 'Notifications non lus', data: result });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de notifications non lus:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.getNotifsUser = async (req, res) => {
  const user_id = req.params.userId;
  try {
    const result = await Notification.getNotificationsUser(user_id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des notifs :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

exports.seeNotification = async (req, res) => {
  const notification_id = req.params.notification_id;
  try {
    const result = await Notification.seeNotifications(notification_id);
    res.status(200).json({ success: true, data: result });
  } catch(error) {
    console.error('Erreur lors de la vue des notifs :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};