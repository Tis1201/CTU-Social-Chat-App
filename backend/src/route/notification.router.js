const express = require("express");
const notificationController = require("../controller/notification.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.use(authMiddleware);

router.get("/:userId", notificationController.getNotificationsByUserIdController);
router.post("/", notificationController.createNotificationController);

module.exports = router;