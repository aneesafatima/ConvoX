const express = require("express");
const multer = require("multer");
const ErrorHandler = require("../utils/errorHandler");
const { protect } = require("../controllers/authController");
const {
  getMessagesForContact,
  deleteChatMessages,
  uploadFile,
  deleteMessage,
  readUnreadMessages,
  sendPhotoAsChat,
  resizeUploadedPhoto,
} = require("../controllers/messageController");
const messageRouter = express.Router();

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/file-uploads");
  },
  filename: (req, file, cb) => {
    console.log(file)
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}`);
  },
});

const multerFilter = (req, file, cb) => {
  const allowedTypes = [
    "msword",
    "vnd.openxmlformats-officedocument.wordprocessingml.document",
    "mp4",
    "mp3",
    "pdf",
  ];
  console.log(file.mimetype);
  if (allowedTypes.includes(file.mimetype.split("/")[1])) {
    cb(null, true);
  } else {
    cb(
      new ErrorHandler(
        "Wrong Format. Allowed Formats are : .doc, .docx, .pdf,.mp4, .mp3",
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter: multerFilter,
});
messageRouter.use(protect);
messageRouter.get("/:type/:chatId", getMessagesForContact);
messageRouter.patch("/delete-chat-messages", deleteChatMessages);

messageRouter.patch("/read-unread-messages", readUnreadMessages);
messageRouter.post("/send-photo-message", sendPhotoAsChat, resizeUploadedPhoto);
messageRouter.patch("/delete-message/:messageId", deleteMessage);
messageRouter.post("/file-upload", upload.single("file-upload"), (req, res) => {
  res.status(200).json({
    status: "success",
    file: req.file.filename,
  });
});

module.exports = messageRouter;
