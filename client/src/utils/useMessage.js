import { useContext } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";
import { handleLastMessageUpdation } from "./helpers";

const useMessage = (input, setInput) => {
  const {
    socket,
    currentUser,
    setMessages,
    selectedChat,
    replyingToMessage,
    setReplyingToMessage,
    setLastMessage,
    setFetchUserChats,
    lastMessage,
  } = useContext(GlobalState);

  //FOR DELETE MESSAGE
  const handleDeleteMessage = (messageId, selectedChat) => {
    console.log("deleting messages", messageId, selectedChat);
    setMessages((prev) => {
      const deletedMessageIndex = prev.findIndex(
        (msg) => msg._id === messageId
      );
      const newMessages = [...prev];
      newMessages[deletedMessageIndex].message = "This message was deleted";
      newMessages[deletedMessageIndex].deleted = "true";
      return newMessages;
    });
    if (selectedChat) {
      socket.emit("delete-message", {
        messageId,
        selectedChatId:
          selectedChat.type === "group"
            ? selectedChat.info._id
            : currentUser._id,
        userId: selectedChat.type !== "group" && selectedChat.info._id,
        type: selectedChat.type,
      });
      setFetchUserChats(true);
    }
  };

  //FOR FILE UPLOAD
  const handleFileUpload = async (e, id, name) => {
    e.stopPropagation();
    const file = document.getElementById(id).files[0];
    const form = new FormData();
    form.append(name, file);
    try {
      const res = await axios({
        url: `${import.meta.env.VITE_URL}/api/messages/${
          name === "photo-upload" ? "send-photo-message" : "file-upload"
        }`,
        method: "POST",
        data: form,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data?.status === "success") {
        socket.emit("send-message", {
          message: res.data.file,
          to: selectedChat.info._id,
          type: selectedChat.type,
          format: name === "photo-upload" ? "photo" : "file",
          replyingToMessage,
        });
        setReplyingToMessage(undefined);
        setLastMessage(
          handleLastMessageUpdation(
            lastMessage,
            selectedChat.info._id,
            name === "photo-upload" ? "photo" : "file"
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  //FOR SENDING MESSAGE
  const handeSendingMessage = () => {
    if (input !== "") {
      socket.emit("send-message", {
        message: input.trim(),
        to: selectedChat.info._id,
        type: selectedChat.type,
        format: "text",
        replyingToMessage,
      });
      if (replyingToMessage) setReplyingToMessage(undefined);
      setInput("");
      setLastMessage(
        handleLastMessageUpdation(
          lastMessage,
          selectedChat.info._id,
          input.trim()
        )
      );
    }
  };
  return {
    handleDeleteMessage,
    handleFileUpload,
    handeSendingMessage,
  };
};
export default useMessage;
