// /routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/send-notification", notificationController.sendPushNotification);
router.get("/non-lu", notificationController.countNotificationNonLu);

module.exports = router;