const express = require("express");
const { protect } = require("../controllers/authController");
const { getMessagesForContact } = require("../controllers/messageController");
const messageRouter = express.Router();
messageRouter.use(protect)
messageRouter.get("/:contactId", getMessagesForContact);


module.exports = messageRouter;

