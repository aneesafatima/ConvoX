const express = require("express");
const { uploadChatMedia } = require("../utils/fileUpload");
const { protect } = require("../controllers/authController");
const {
  getMessagesForContact,
  deleteChatMessages,
  deleteMessage,
  readUnreadMessages,
  getLastMessages,
} = require("../controllers/messageController");
const messageRouter = express.Router();

messageRouter.use(protect);
messageRouter.get("/:type/:chatId", getMessagesForContact);
messageRouter.patch("/delete-chat-messages", deleteChatMessages);

messageRouter.patch("/read-unread-messages", readUnreadMessages);
messageRouter.patch("/delete-message/:messageId", deleteMessage);
messageRouter.post("/file-upload/:type", uploadChatMedia, (req, res) => {
  res.status(200).json({
    status: "success",
    file: decodeURIComponent(req.file.path.split("/")[8]) + req.ext
  });
});
messageRouter.get("/last-messages", getLastMessages)

module.exports = messageRouter;
