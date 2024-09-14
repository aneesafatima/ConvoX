const User = require("../models/userModel");
const connectedUsers = [];

const unreadMessages = async (sender, receiver) => {
  const receiverData = await User.findById(receiver).select("unreadMessages");

  if (!receiverData.unreadMessages.find((el) => el.from?.toString() === sender))
    await User.findByIdAndUpdate(receiver, {
      $push: { unreadMessages: { from: sender, count: 1 } },
    });
  else
    await User.findOneAndUpdate(
      { _id: receiver, "unreadMessages.from": sender },
      { $inc: { "unreadMessages.$.count": 1 } }
    );
};

module.exports = { connectedUsers, unreadMessages };
