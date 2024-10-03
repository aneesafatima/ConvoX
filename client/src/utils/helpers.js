import React from "react"; // Needed for React.createElement
import {
  BsFillFileEarmarkPdfFill,
  BsFileEarmarkWordFill,
} from "react-icons/bs";
import { FaFileAudio, FaFileVideo } from "react-icons/fa6";
import { showAlert } from "./showAlert";

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
    case "vnd.openxmlformats":
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

export const handleImageUpload = (res, imgSetter) => {
  imgSetter(JSON.parse(res.xhr.response).imageUrl + ".jpeg");
  showAlert("Profile picture updated", "home");
};

export const getCloudinaryUrl = (resourceType, publicId) => {
  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/v1727867209/chats/${publicId}`;
};

