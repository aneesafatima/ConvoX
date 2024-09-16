const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
  replyingToMessage: String,
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  format: {
    type: String,
    enum: ["photo", "file", "text"],
    default: "text"
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
messageSchema.index({timestamp: -1});
messageSchema.index({ groupId: 1 });
messageSchema.index({ sender: 1, receiver: 1 });
const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
