import React, { useContext, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { IoSend } from "react-icons/io5";
import { MdInsertPhoto } from "react-icons/md";
import { FaReply } from "react-icons/fa6";
import { SiFiles } from "react-icons/si";
import { GlobalState } from "../context/GlobalState";
import useMessage from "../utils/useMessage";

function MessageInputBox() {
  const { selectedChat, setReplyingToMessage, replyingToMessage, showLoader } =
    useContext(GlobalState);
  const [input, setInput] = useState("");
  const { handleFileUpload, handeSendingMessage } = useMessage(input, setInput);
  if (selectedChat.type === "group" && !selectedChat.info.active)
    return (
      <div className="sticky bottom-0 m-auto font-nunito text-sm w-full text-center  ">
        This group has been deleted by admin
      </div>
    );

  return (
    <div className="sticky bottom-0 m-auto  w-fit h-10  flex items-center mb-2 justify-center ">
      {replyingToMessage && (
        <div className="absolute left-0 z-50 flex flex-col font-nunito  bottom-full   shadow-sm w-48 text-xs space-y-2 p-3 rounded-md mb-3 ">
          <span className="flex items-center justify-between">
            <span className="flex items-center font-semibold">
              <FaReply size={13} className="mr-2  " />
              Replying
            </span>
            <RxCross2
              onClick={() => setReplyingToMessage(false)}
              className="cursor-pointer"
            />
          </span>
          <span>{replyingToMessage}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="type a message"
        className={`w-[60svw] bg-[#e1dfdf5c] h-8 px-3 sm:px-5 sm:py-5 rounded-full text-sm outline-0 border-0 font-nunito font-medium ${
          selectedChat.type === "group" && !selectedChat.info.active
            ? "cursor-not-allowed"
            : null
        }`}
        id="message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {showLoader.feature === "sending-message" ? (
        <span
          className="loader"
          style={{ borderColor: "#333333", margin: "0 5px" }}
        ></span>
      ) : (
        <IoSend
          onClick={handeSendingMessage}
          className={`${
            input === "" ? "pointer-events-none" : "cursor-pointer"
          } mx-1`}
          color={input === "" ? "#333333" : "#3b82f6"}
        />
      )}

      <div className=" w-5 h-6 relative cursor-pointer">
        <input
          type="file"
          accept="image/*"
          name="photo-upload"
          className="w-full h-full opacity-0 absolute   "
          onChange={(e) => handleFileUpload(e, "photo-message", "photo-upload")}
          id="photo-message"
          disabled={selectedChat.type === "group" && !selectedChat.info.active}
        />

        <MdInsertPhoto
          className="cursor-pointer w-full h-full mr-1"
          color="#333333"
        />
      </div>
      <div className=" w-5 h-6 relative cursor-pointer">
        <input
          type="file"
          accept=".doc,.docx,.pdf,.mp4,.mp3"
          name="file-upload"
          className="w-full h-full opacity-0 absolute  "
          onChange={(e) => handleFileUpload(e, "file-message", "file-upload")}
          id="file-message"
          disabled={selectedChat.type === "group" && !selectedChat.info.active}
        />

        <SiFiles
          className="cursor-pointer w-full h-full ml-1"
          color="#333333"
        />
      </div>
    </div>
  );
}

export default MessageInputBox;
