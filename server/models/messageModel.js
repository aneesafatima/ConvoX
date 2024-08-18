const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  receiver: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
  timestamp: {
    type: Date,
    default: new Date(),
  },
  isGroupMessage: {
    type: Boolean,
    default: false,
  },
});

const Message = new mongoose.model("Message", MessageSchema);

module.exports = Message;
