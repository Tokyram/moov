// /services/firebaseService.js
const admin = require("../config/firebaseAdmin");

const sendNotification = async (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    throw new Error("Erreur lors de l'envoi de la notification : " + error.message);
  }
};

module.exports = {
  sendNotification,
};
