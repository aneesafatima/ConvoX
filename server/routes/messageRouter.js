const express = require("express");
const { protect } = require("../controllers/authController");
const { getMessagesForContact, deleteChatMessages , readUnreadMessages, sendPhotoAsChat, resizeUploadedPhoto} = require("../controllers/messageController");
const messageRouter = express.Router();
messageRouter.use(protect)
messageRouter.get("/:type/:chatId", getMessagesForContact);
messageRouter.patch("/delete-chat-messages", deleteChatMessages);

messageRouter.patch("/read-unread-messages", readUnreadMessages);
messageRouter.post("/send-photo-message",  sendPhotoAsChat, resizeUploadedPhoto);

module.exports = messageRouter;

