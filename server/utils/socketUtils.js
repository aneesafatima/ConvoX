const User = require("../models/userModel");
const Message = require("../models/messageModel");
const connectedUsers = [];

const unreadMessages = async (contactId, receiver) => {
  const receiverData = await User.findById(receiver).select("unreadMessages");
  if (
    !receiverData?.unreadMessages.find(
      (el) => el.from?.toString() === contactId
    )
  )
    await User.findByIdAndUpdate(receiver, {
      $push: { unreadMessages: { from: contactId, count: 1 } },
    });
  else {
    await User.findOneAndUpdate(
      { _id: receiver, "unreadMessages.from": contactId },
      { $inc: { "unreadMessages.$.count": 1 } },
      {
        new: true,
      }
    );
  }
};

const createMessage = async (userId, data) => {
  await Message.create({
    sender: userId,
    groupId: data.to,
    message: data.message,
    isGroupMessage: data.type === "group",
    format: data.format,
    replyingToMessage: data.replyingMessage,
  });
};
module.exports = { connectedUsers, unreadMessages, createMessage };
