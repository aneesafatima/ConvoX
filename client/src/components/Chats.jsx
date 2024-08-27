import React, { useContext, useEffect } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";
import { ImExit } from "react-icons/im";
import { showAlert } from "../utils/showAlert";
import { IoMdSettings } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { ReactTooltip } from ".";

function Chats() {
  const {
    selectedChat,
    socket,
    messages,
    setMessages,
    fetchMessages,
    setFetchMessages,
    currentUser,
    allUsers,
    setSelectedChat,
    setFetchUserChats,
    setShowGroupSettings,
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
          setTimeout(() => {
            const scrollContainer = document.getElementById("scroll-container");
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 100);

          setMessages(res.data.messages);
          setFetchMessages(false);
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

  const handleGroupExit = async (userId, groupId) => {
    const res = await axios.post(
      `${import.meta.env.VITE_URL}/api/groups/exit-group`,
      {
        userId,
        groupId,
      },
      {
        withCredentials: true,
      }
    );
    if (res.data?.status === "success") {
      setTimeout(() => {
        setSelectedChat(null);
        setFetchUserChats(true);
        showAlert(
          `You have exited the group ${selectedChat.info.name}`,
          "home"
        );
      }, 500);
    }
  };

  const handleDeleteChats = async () => {
    try {
      const res = await axios({
        url: `${import.meta.env.VITE_URL}/api/messages/delete-chat-messages`,
        data: {
          userId: currentUser._id,
          receiverId: selectedChat.info._id,
        },
        method: "PATCH",
        withCredentials: true,
      });
      if (res.data.status === "success") {
        setFetchMessages(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    selectedChat && (
      <div className="flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow relative ">
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
            <MdDeleteForever
              size={22}
              className="text-red-500 hover:text-red-600   cursor-pointer outline-none border-none"
              data-tooltip-id="delete-chats"
              data-tooltip-content="delete chats"
              onClick={() => handleDeleteChats(currentUser._id)}
            />
          )}
        </div>
        <div
          className="border rounded-lg w-full h-full overflow-auto flex flex-col pb-12"
          id="scroll-container"
        >
          <ul className="p-4 px-10 space-y-6 flex flex-col">
            {messages?.map((message) =>
              message?.deletedBy.includes(currentUser._id) ? null : (
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
                    {message.sender !== currentUser._id
                      ? message.isGroupMessage
                        ? allUsers.find((user) => user._id === message.sender)
                            .name
                        : selectedChat.info.name
                      : null}
                    <span className="mx-2 text-[#b2b2b2] text-[8px] ">
                      {new Date(message.timestamp).toLocaleDateString(
                        "en-US"
                      ) === new Date(Date.now()).toLocaleDateString("en-US")
                        ? new Date(message.timestamp).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit", hour12: true }
                          )
                        : new Date(message.timestamp).toLocaleDateString(
                            "en-US"
                          )}
                    </span>
                  </span>
                </li>
              )
            )}
          </ul>
          <div className="absolute bottom-0 -translate-y-full w-[60%]  left-1/2 -translate-x-1/2  flex">
            <input
              type="text"
              placeholder="type a message"
              className={`w-full bg-[#f4f2f2] p-2 rounded-s-lg text-sm outline-0 border-0 ${
                selectedChat.type === "group" && !selectedChat.info.active
                  ? "cursor-not-allowed"
                  : null
              }`}
              id="message"
              disabled={
                selectedChat.type === "group" && !selectedChat.info.active
              }
            />
            <button
              className="text-white font-roboto bg-[#333333] hover:bg-black rounded-e-lg px-2 text-sm"
              onClick={handeSendingMessage}
            >
              send
            </button>
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
          </div>
        </div>
      </div>
    )
  );
}

export default Chats;
