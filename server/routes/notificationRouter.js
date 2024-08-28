const express = require("express");
const { protect } = require("../controllers/authController");
const {
  getNotifications,
  createNotifictaion,
  readAllNotifications,
} = require("../controllers/notificationController");
const notificationRouter = express.Router();
notificationRouter.use(protect);
notificationRouter.get("/:userId", getNotifications);
notificationRouter.patch("/", readAllNotifications);

module.exports = notificationRouter;
