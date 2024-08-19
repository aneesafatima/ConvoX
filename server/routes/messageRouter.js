const express = require("express");
const { protect } = require("../controllers/authController");
const { getMessagesForContact } = require("../controllers/messageController");
const Message = require( "../models/messageModel" );
const { get } = require( "http" );
const messageRouter = express.Router();
messageRouter.get("/messagesOfContact", getMessagesForContact);


module.exports = homeRouter;