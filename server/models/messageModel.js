const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  isPhoto: { type: Boolean, default: false },
  isGroupMessage: {
    type: Boolean,
    default: false,
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Message = new mongoose.model("Message", MessageSchema);

module.exports = Message;
