const Message = require("../models/messageModel");
exports.getMessagesForContact = catchAsync(async (req, res, next) => {
const contactId = req.query.contactId;
const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: contactId },
      { sender: contactId, receiver: req.user._id }
    ]
  }).sort({ timestamp: 1 });
res.status(200).json({
    status: "success",
    messages
  });
});
  