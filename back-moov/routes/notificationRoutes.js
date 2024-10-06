// /routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require('../middleware/auth');

router.post("/send-notification", notificationController.sendPushNotification);
router.get("/non-lu/:userId", authMiddleware, notificationController.countNotificationNonLu);
router.get("/:userId", authMiddleware, notificationController.getNotifsUser);

module.exports = router;