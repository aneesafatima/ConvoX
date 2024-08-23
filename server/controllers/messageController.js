const Message = require("../models/messageModel");
exports.getMessagesForContact = catchAsync(async (req, res, next) => {
  let messages;
  const { chatId, type } = req.params;
  if (type === "group") {
    messages = await Message.find({
      groupId: chatId,
    }).sort({ timestamp: 1 });
  } else {
    messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: chatId },
        { sender: chatId, receiver: req.user._id },
      ],
    }).sort({ timestamp: 1 });
  }
  res.status(200).json({
    status: "success",
    messages,
  });
});
