// /controllers/notificationController.js
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