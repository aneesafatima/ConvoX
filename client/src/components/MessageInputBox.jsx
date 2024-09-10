import React, { useContext ,useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import { MdInsertPhoto } from "react-icons/md";

import { FaReply } from "react-icons/fa6";
import { SiFiles } from "react-icons/si";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";

function MessageInputBox({ setReplyingMessage, replyingMessage }) {
  const { selectedChat , socket, setMessages,currentUser, setFetchMessages} = useContext(GlobalState);
  const [input, setInput] = useState("");

  const handleFileUpload = async (id, name) => {
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
          replyingMessage,
        });
        setMessages((prev) => [
          ...prev,
          {
            message: res.data.file,
            sender: currentUser._id,
            receiver: selectedChat.info._id,
            timestamp: Date.now(),
            format: name === "photo-upload" ? "photo" : "file",
            replyingMessage,
          },
        ]);
        setFetchMessages(true);
        setReplyingMessage(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handeSendingMessage = () => {
    if (input !== "") {
      socket.emit("send-message", {
        message: input,
        to: selectedChat.info._id,
        type: selectedChat.type,
        replyingMessage,
      });
      setFetchMessages(true);
      setMessages((prev) => [
        ...prev,
        {
          message: input,
          sender: currentUser._id,
          receiver: selectedChat.info._id,
          timestamp: Date.now(),
          replyingMessage,
        },
      ]);
      if (replyingMessage) setReplyingMessage(false);
      setInput("");
    }
  };
  return (
    <div className="sticky bottom-0  w-full  h-10  flex items-center mb-2 justify-center space-x-2 ">
      {replyingMessage && (
        <div className="absolute bottom-full flex flex-col font-nunito   bg-[#f7f7f7]  shadow-sm w-48 text-xs space-y-2 p-3 rounded-md mb-3 -translate-x-[32%] ">
          <span className="flex items-center justify-between">
            <span className="flex items-center font-semibold">
              <FaReply size={13} className="mr-2  " />
              Replying
            </span>
            <RxCross2
              onClick={() => setReplyingMessage(false)}
              className="cursor-pointer"
            />
          </span>
          <span>{replyingMessage}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="type a message"
        className={`w-[60%] bg-[#e1dfdf5c] h-8 px-3 sm:px-5 sm:py-5 rounded-full text-sm outline-0 border-0 font-nunito font-medium ${
          selectedChat.type === "group" && !selectedChat.info.active
            ? "cursor-not-allowed"
            : null
        }`}
        id="message"
        disabled={selectedChat.type === "group" && !selectedChat.info.active}
        value={input}
        onChange={(e) => setInput(e.target.value.trim())}
      />
      <IoSend
        onClick={handeSendingMessage}
        className="cursor-pointer"
        color={input === "" ? "#333333" : "#3b82f6"}
      />
      <div className=" w-5 h-6 relative cursor-pointer">
        <input
          type="file"
          accept="image/*"
          name="photo-upload"
          className="w-full h-full opacity-0 absolute  "
          onChange={() => handleFileUpload("photo-message", "photo-upload")}
          id="photo-message"
        />

        <MdInsertPhoto
          className="cursor-pointer w-full h-full "
          color="#333333"
        />
      </div>
      <div className=" w-5 h-6 relative cursor-pointer">
        <input
          type="file"
          accept=".doc,.docx,.pdf,.mp4,.mp3"
          name="file-upload"
          className="w-full h-full opacity-0 absolute  "
          onChange={() => handleFileUpload("file-message", "file-upload")}
          id="file-message"
        />

        <SiFiles className="cursor-pointer w-full h-full " color="#333333" />
      </div>
    </div>
  );
}

export default MessageInputBox;
