const catchAsync = require("../utils/catchAsync");
const Notification = require("../models/notificationModel");
exports.getNotifications = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const notifications = await Notification.find({
    userIds: userId,
    read: { $nin: [userId] },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    notifications,
  });
});

exports.readAllNotifications = catchAsync(async (req, res, next) => {
  console.log("Entered reading controller")
  await Notification.updateMany(
    { userIds: req.body.userId },
    { $push: { read: req.body.userId } }
  );
  res.status(200).json({
    status: "success",
  });
});
