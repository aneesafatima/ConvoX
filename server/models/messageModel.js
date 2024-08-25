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
  isGroupMessage: {
    type: Boolean,
    default: false,
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
});

const Message = new mongoose.model("Message", MessageSchema);

module.exports = Message;
