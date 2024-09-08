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
  type: {
    type: String,
    enum: ["photo", "file", "text"],
  },
  isGroupMessage: {
    type: Boolean,
    default: false,
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  deleted: {
    type: Boolean,
    default: false,
  },

  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Message = new mongoose.model("Message", MessageSchema);

module.exports = Message;
