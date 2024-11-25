const Notification = require("../model/notification.model");
const Paginator = require("./paginator");
const userService = require("./user.service");

const createNotification = async (notificationData) => {
  const notification = new Notification(notificationData);
  await notification.save();
  return notification;
};

const getNotificationsByUserId = async (userId, page, limit) => {
  const paginator = new Paginator(page, limit);


  const notifications = await Notification.find({ user_id: userId })
    .skip(paginator.offset)
    .limit(paginator.limit);

  const totalNotifications = await Notification.countDocuments({ user_id: userId });
  const metadata = paginator.getMetadata(totalNotifications);

  const notificationsWithUserDetails = await Promise.all(
    notifications.map(async (notification) => {

      const relatedUser = await userService.getUserById(notification.related_user_id);

      return {
        ...notification.toObject(),
        related_user: relatedUser ? {
          full_name: relatedUser.full_name,
          avatar_url: relatedUser.avatar_url
        } : null,
      };
    })
  );

  return { notifications: notificationsWithUserDetails, metadata };
};
 

module.exports = {
  createNotification,
  getNotificationsByUserId,
};
