import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { ImExit } from "react-icons/im";
import { IoMdSettings } from "react-icons/io";
import { Message, ReactTooltip, MessageInputBox } from ".";
import { HiUserRemove } from "react-icons/hi";
import { useChatHandlers } from "../utils/useChatHandlers";
import { MdDeleteForever } from "react-icons/md";

function Chats() {
  const {
    selectedChat,
    messages,
    currentUser,
    setShowGroupSettings,
  } = useContext(GlobalState);

  const { handleGroupExit, handleDeleteChats, handleUserRemovalFromChats } =
    useChatHandlers(); //called on every render abd uses this component's lifecycle

  const [replyingMessage, setReplyingMessage] = useState(null);



  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = document.getElementById("scroll-container");
      if (scrollContainer)
        scrollContainer.scrollTop = scrollContainer?.scrollHeight;
    }, 100);
  }, [selectedChat, messages]);

  return (
    selectedChat && (
      <div className="flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow  relative w-svw xs:w-fit">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-roboto font-semibold text-[#333333] ">
            Chats with {selectedChat.info.name}
          </h2>
          {selectedChat.type === "group" ? (
            <span className="flex items-center space-x-3">
              <IoMdSettings
                size={22}
                color="#333333 "
                className="cursor-pointer outline-none border-none"
                data-tooltip-id="settings-of-group"
                data-tooltip-content="settings"
                onClick={() => setShowGroupSettings(true)}
              />
              <ImExit
                size={19}
                color="#333333 "
                className="cursor-pointer outline-none border-none"
                data-tooltip-id="exit-group"
                data-tooltip-content="exit group"
                onClick={() =>
                  handleGroupExit(currentUser._id, selectedChat.info._id)
                }
              />
            </span>
          ) : (
            <span className="flex items-center space-x-3">
              <HiUserRemove
                size={22}
                className="text-red-500 hover:text-red-600 cursor-pointer outline-none border-none"
                data-tooltip-id="remove-contact"
                data-tooltip-content="remove contact"
                onClick={() =>
                  handleUserRemovalFromChats(
                    selectedChat.info._id,
                    selectedChat.type === "group" ? "groupIds" : "contacts"
                  )
                }
              />
              <MdDeleteForever
                size={22}
                className="text-red-500 hover:text-red-600   cursor-pointer outline-none border-none"
                data-tooltip-id="delete-chats"
                data-tooltip-content="delete chats"
                onClick={() => handleDeleteChats(currentUser._id)}
              />
            </span>
          )}
        </div>
        <div className="border rounded-lg w-full h-[90%] flex flex-col pb-12 relative">
          <ul
            className="p-4 px-10 space-y-6 flex flex-col text-sm font-nunito font-medium h-full overflow-auto"
            id="scroll-container"
          >
            {messages?.map((message, i) =>
              message?.deletedBy?.includes(currentUser._id) ? null : (
                <Message
                  key={i}
                  message={message}
                  setReplyingMessage={setReplyingMessage}
                />
              )
            )}
          </ul>
          <MessageInputBox
            replyingMessage={replyingMessage}
            setReplyingMessage={setReplyingMessage}
          />
        </div>
        <ReactTooltip
          className="tooltip"
          id="exit-group"
          style={{ backgroundColor: "#333333 " }}
        />
        <ReactTooltip
          className="tooltip"
          id="settings-of-group"
          style={{ backgroundColor: "#333333 " }}
        />
        <ReactTooltip
          className="tooltip"
          id="delete-chats"
          style={{ backgroundColor: "#ef4444 " }}
        />
        <ReactTooltip
          className="tooltip"
          id="remove-contact"
          style={{ backgroundColor: "#ef4444 " }}
        />
      </div>
    )
  );
}

export default Chats;
