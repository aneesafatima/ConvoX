const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  message: {
    type: String,
    required: true,
  },
  read: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
