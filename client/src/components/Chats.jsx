import React, { useContext, useEffect } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";

function Chats() {
  const {
    selectedUser,
    socket,
    messages,
    setMessages,
    fetchMessages,
    setFetchMessages,
  } = useContext(GlobalState);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/messages/${selectedUser._id}`,
          { withCredentials: true }
        );
        if (res.data?.status === "success") {
          setMessages(res.data.messages);
          setFetchMessages(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (selectedUser || fetchMessages) fetchData();
  }, [selectedUser, fetchMessages]);

  const handeSendingMessage = () => {
    const message = document.getElementById("message");
    setFetchMessages(true);
    socket.emit("send-message", {
      message: message.value,
      to: selectedUser._id,
    });
    message.value = "";
  };
  return (
    selectedUser && (
      <div className="flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow relative ">
        <h2 className="text-2xl font-roboto font-semibold ">
          Chats with {selectedUser.name}
        </h2>
        <div className="border rounded-lg w-full h-full overflow-auto flex flex-col pb-12">
          <ul className="p-4 px-10 space-y-6 flex flex-col">
            {messages?.map((message) => (
              <li
                className={`text-sm flex flex-col ${
                  message.receiver !== selectedUser._id
                    ? "self-start "
                    : "self-end "
                } `}
              >
                <span
                  className={`pointer-events-none ${
                    message.receiver !== selectedUser._id
                      ? "bg-[#E8F5E9] self-start rounded-bl-none"
                      : "bg-[#E0F7FA] self-end rounded-br-none"
                  } p-3 rounded-lg`}
                >
                  {message.message}
                </span>
                <span className="text-[10px] pl-2 text-[#414141] font-nunito font-semibold">
                  {message.receiver !== selectedUser._id
                    ? selectedUser.name
                    : null}
                  <span className="mx-2 text-[#b2b2b2] text-[8px] ">
                    {new Date(message.timestamp).toLocaleDateString("en-US") ===
                    new Date(Date.now()).toLocaleDateString("en-US")
                      ? new Date(message.timestamp).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit",minute:'2-digit', hour12: true }
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
