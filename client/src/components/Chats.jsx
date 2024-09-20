import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { Message, MessageInputBox, ShowFiles, ChatsHeader, ReactTooltip } from ".";


function Chats() {
  const { selectedChat, messages, currentUser,replyingToMessage, setReplyingToMessage } =
    useContext(GlobalState);

  
  const [showFilesMessages, setShowFilesMessages] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = document.getElementById("scroll-container");
      if (scrollContainer)
        scrollContainer.scrollTop = scrollContainer?.scrollHeight;
    }, 100);
  }, [selectedChat, messages]);

  return (
    selectedChat && (
      <div className="flex font-lato flex-col space-y-5 pt-3 px-5  flex-grow relative  w-svw xs:w-fit ">
        {!messages && (
          <div
            className="main-loader absolute top-1/2 -translate-y-1/2 left-1/2
          -translate-x-1/2"
          ></div>
        )}
        <ChatsHeader setShowFilesMessages={setShowFilesMessages} />

        <div className="border rounded-lg w-full h-[90%] flex flex-col pb-12 pt-4  relative">
          <ul
            className="p-4 px-10 space-y-6 flex flex-col text-sm font-nunito font-medium h-full overflow-auto"
            id="scroll-container"
          >
            {messages?.map((message, i) =>
              message?.deletedBy?.includes(currentUser._id) ? null : (
                <Message
                  key={i}
                  message={message}
                 
                />
              )
            )}
          </ul>

          <MessageInputBox
          />
        </div>
        {showFilesMessages && <ShowFiles />}
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
          style={{ backgroundColor: "#333333 " }}
        />
        <ReactTooltip
          className="tooltip"
          id="remove-contact"
          style={{ backgroundColor: "#333333 " }}
        />
        <ReactTooltip
          className="tooltip"
          id="view-files"
          style={{ backgroundColor: "#333333 " }}
        />
      </div>
    )
  );
}

export default Chats;
