const Message = require("../models/messageModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const multer = require("multer");
const sharp = require("sharp");

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
  await sharp(req.file.buffer)
    .resize(600, 700)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/chats/${req.file.filename}`);
  res.status(200).json({
    status: "success",
    file: req.file.filename,
  });
});

exports.deleteMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  console.log(messageId);
  await Message.findByIdAndUpdate(messageId, {
    message: "This message was deleted",
    deleted: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.uploadFile = () => {
  
}