const express = require("express");
const { protect } = require("../controllers/authController");
const { getMessagesForContact, deleteChatMessages } = require("../controllers/messageController");
const messageRouter = express.Router();
messageRouter.use(protect)
messageRouter.get("/:type/:chatId", getMessagesForContact);
messageRouter.patch("/delete-chat-messages", deleteChatMessages);


module.exports = messageRouter;

