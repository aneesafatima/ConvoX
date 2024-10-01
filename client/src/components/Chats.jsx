import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { Message, MessageInputBox, ShowFiles, ChatsHeader, ReactTooltip } from ".";


function Chats({setContacts}) {
  const { selectedChat, messages, currentUser} =
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
      <div className="flex font-lato flex-col space-y-5 pt-3 px-5  flex-grow relative  w-svw xs:w-fit overflow-x-hidden">
        {!messages && (
          <div
            className="main-loader absolute top-1/2 -translate-y-1/2 left-1/2
          -translate-x-1/2"
          ></div>
        )}
        <ChatsHeader setShowFilesMessages={setShowFilesMessages}  setContacts={setContacts}/>

        <div className="border rounded-lg w-full h-[90%] flex flex-col pb-12 pt-4  relative">
          <ul
            className="p-4 px-5 space-y-6 flex flex-col text-sm font-nunito font-medium h-full overflow-y-auto overflow-x-hidden"
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
      </div>
    )
  );
}

export default Chats;
