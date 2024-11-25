const notificationService = require("../service/notification.service");

const getNotificationsByUserIdController = async (req, res) => {
  const { userId } = req.params;
  const { page, limit } = req.query;
  try {
    const notifications = await notificationService.getNotificationsByUserId(userId, page, limit);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotificationController = async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotificationsByUserIdController,
  createNotificationController,
};
