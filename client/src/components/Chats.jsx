import React, { useContext, useEffect } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";

function Chats() {
  //fix time issue in messages
  const {
    selectedChat,
    socket,
    messages,
    setMessages,
    fetchMessages,
    setFetchMessages,
    currentUser,
  } = useContext(GlobalState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/messages/${selectedChat.type}/${
            selectedChat.info._id
          }`,
          { withCredentials: true }
        );
        if (res.data?.status === "success") {
          setMessages(res.data.messages);
          setFetchMessages(false);
          const scrollContainer = document.getElementById("scroll-container");
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedChat || fetchMessages) fetchData();
  }, [selectedChat, fetchMessages]);

  const handeSendingMessage = () => {
    const message = document.getElementById("message");
    socket.emit("send-message", {
      message: message.value,
      to: selectedChat.info._id,
      type: selectedChat.type,
    });
    message.value = "";
    setFetchMessages(true);
  };
  return (
    selectedChat && (
      <div className="flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow relative ">
        <h2 className="text-2xl font-roboto font-semibold ">
          Chats with {selectedChat.info.name}
        </h2>
        <div
          className="border rounded-lg w-full h-full overflow-auto flex flex-col pb-12"
          id="scroll-container"
        >
          <ul className="p-4 px-10 space-y-6 flex flex-col">
            {messages?.map((message) => (
              <li
                className={`text-sm flex flex-col ${
                  message.sender === currentUser._id
                    ? "self-end"
                    : "self-start "
                } `}
              >
                <span
                  className={`pointer-events-none ${
                    message.sender !== currentUser._id
                      ? "bg-[#E8F5E9] self-start rounded-bl-none"
                      : "bg-[#E0F7FA] self-end rounded-br-none"
                  } p-3 rounded-lg`}
                >
                  {message.message}
                </span>
                <span className="text-[10px] pl-2 text-[#414141] font-nunito font-semibold">
                  {message.receiver !== selectedChat.info._id
                    ? selectedChat.info.name
                    : null}
                  <span className="mx-2 text-[#b2b2b2] text-[8px] ">
                    {new Date(message.timestamp).toLocaleDateString("en-US") ===
                    new Date(Date.now()).toLocaleDateString("en-US")
                      ? new Date(message.timestamp).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit", hour12: true }
                        )
                      : new Date(message.timestamp).toLocaleDateString("en-US")}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-0 -translate-y-full w-[60%]  left-1/2 -translate-x-1/2  flex">
            <input
              type="text"
              placeholder="type a message"
              className="w-full bg-[#f4f2f2] p-2 rounded-s-lg text-sm outline-0 border-0"
              id="message"
            />
            <button
              className="text-white font-roboto bg-[#2c2c2c] hover:bg-black rounded-e-lg px-2 text-sm"
              onClick={handeSendingMessage}
            >
              send
            </button>
          </div>
        </div>
      </div>
    )
  );
}
//#E8F5E9

export default Chats;
