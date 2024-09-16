// /routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/send-notification", notificationController.sendPushNotification);

module.exports = router;