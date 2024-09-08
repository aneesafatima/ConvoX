const express = require("express");
const { protect } = require("../controllers/authController");
const { getMessagesForContact, deleteChatMessages , deleteMessage, readUnreadMessages, sendPhotoAsChat, resizeUploadedPhoto} = require("../controllers/messageController");
const messageRouter = express.Router();
messageRouter.use(protect)
messageRouter.get("/:type/:chatId", getMessagesForContact);
messageRouter.patch("/delete-chat-messages", deleteChatMessages);

messageRouter.patch("/read-unread-messages", readUnreadMessages);
messageRouter.post("/send-photo-message",  sendPhotoAsChat, resizeUploadedPhoto);
messageRouter.patch("/delete-message/:messageId",  deleteMessage);
// messageRouter.post("/upload-file",  sendPhotoAsChat);

module.exports = messageRouter;

