const catchAsync = require("../utils/catchAsync");
const Notification = require("../models/notificationModel");
exports.getNotifications = catchAsync(async (req, res, next) => {
    const {userId} = req.params;
    const notifications = await Notification.find({userId, read: false}).sort({createdAt: -1});
  res.status(200).json({
    status: "success",
    notifications,
  });
});

exports.readAllNotifications = catchAsync(async (req, res, next) => {
  await Notification.updateMany({userId: req.body.userId}, {read: true});
  res.status(200).json({
    status: "success",
  });
})