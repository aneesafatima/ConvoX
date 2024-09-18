const Message = require("../models/messageModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const multer = require("multer");
const sharpResizing = require("../utils/sharpResizing");

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

exports.deleteChatMessages = catchAsync(async (req, res, next) => {
  const { userId, receiverId } = req.body;
  await Message.updateMany(
    {
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    },
    {
      $push: {
        deletedBy: userId,
      },
    }
  );
  res.status(200).json({
    status: "success",
  });
});

exports.readUnreadMessages = catchAsync(async (req, res, next) => {
  const { userId, senderId } = req.body;
  await User.findByIdAndUpdate(userId, {
    $pull: { unreadMessages: { from: senderId } },
  });

  res.status(200).json({
    status: "success",
  });
});

const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});
exports.sendPhotoAsChat = upload.single("photo-upload");
exports.resizeUploadedPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `chat-${req.user._id}-${Date.now()}.jpeg`;
  sharpResizing(`chats`, req);
  res.status(200).json({
    status: "success",
    file: req.file.filename,
  });
});
exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  await Message.findOneAndUpdate({timestamp: messageId}, {
    message: "This message was deleted",
    deleted: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.getLastMessages = catchAsync(async (req, res, next) => {
  let message;
  const sender = req.user;

  const userContacts = sender.contacts.concat(sender.groupIds);

  const messagePromises = userContacts?.map(async (contact) => {
    message = await Message.findOne({
      $or: [
        { groupId: contact._id },
        { sender: sender._id, receiver: contact._id },
        { receiver: sender._id, sender: contact._id },
      ],

      deleted: false,
      deletedBy: { $nin: [sender._id] },
    })
      .sort({ timestamp: -1 })
      .select("message timestamp format");

    if (message) {
      return {
        message: message.format !== "text" ? message.format : message.message,
        timestamp: message.timestamp,
        contactId: contact._id,
      };
    } else {
      return {
        message: "No Messages Yet",
        timestamp: 0,
        contactId: contact._id,
      };
    }
  });

  const lastMessages = await Promise.all(messagePromises);
  res.status(200).json({
    status: "success",
    lastMessages: lastMessages.filter((el) => el !== undefined),
  });
});
