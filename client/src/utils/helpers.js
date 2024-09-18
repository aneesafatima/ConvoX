import React from "react"; // Needed for React.createElement
import {
  BsFillFileEarmarkPdfFill,
  BsFileEarmarkWordFill,
} from "react-icons/bs";
import { FaFileAudio, FaFileVideo } from "react-icons/fa6";

export const getFormattedDate = (date) => {
  if (!date) return;
  return new Date(date).toLocaleDateString("en-US") ===
    new Date(Date.now()).toLocaleDateString("en-US")
    ? new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : new Date(date).toLocaleDateString("en-US");
};

// React components without JSX
export const getFileIcon = (fileType) => {
  switch (fileType) {
    case "pdf":
      return React.createElement(BsFillFileEarmarkPdfFill, {
        size: 70,
        color: "#E94F4F",
      });
    case "vnd.openxmlformats-officedocument.wordprocessingml.document":
      return React.createElement(BsFileEarmarkWordFill, {
        size: 70,
        color: "#2B579A",
      });
    case "mp3":
      return React.createElement(FaFileAudio, { size: 70, color: "#1DB954" });
    case "mp4":
      return React.createElement(FaFileVideo, { size: 70, color: "#4DB6AC" });
    default:
      return null;
  }
};

export const handleLastMessageUpdation = (lastMessage, contactId, message) => {
  const updatedLastMessage = [...lastMessage];
  const existingIndex = updatedLastMessage.findIndex(
    (el) => el.contactId === contactId
  );
  if (existingIndex !== -1) {
    updatedLastMessage[existingIndex].message = message;
    updatedLastMessage[existingIndex].timestamp = Date.now();
    return updatedLastMessage;
  } else {
    return lastMessage
      ? [...lastMessage, { contactId, message, timestamp: Date.now() }]
      : [{ contactId, message, timestamp: Date.now() }];
  }
};

//delete message
export const handleDeleteMessage = (
  socket,
  messageId,
  setMessages,
  currentUser,
  selectedChat
) => {
  setMessages((prev) => {
    const deletedMessageIndex = prev.findIndex(
      (msg) => msg.timestamp === messageId
    );
    const newMessages = [...prev];
    newMessages[deletedMessageIndex].message = "This message was deleted";
    newMessages[deletedMessageIndex].deleted = "true";
    return newMessages;
  });
  if (selectedChat) {
    console.log("selectedChat", selectedChat);
    socket.emit("delete-message", {
      id: messageId,
      chatId:
        selectedChat.type === "group" ? currentUser._id : selectedChat.info._id,
      userId: selectedChat.info._id,
    });
  }
};
