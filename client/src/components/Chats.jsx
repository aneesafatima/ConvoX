import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";
import { ImExit } from "react-icons/im";
import { showAlert } from "../utils/showAlert";
import { IoMdSettings } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { ReactTooltip } from ".";
import { getFormattedDate } from "../utils/helpers";
import { HiUserRemove } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { MdInsertPhoto } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { SiFiles } from "react-icons/si";

function Chats() {
  const {
    selectedChat,
    socket,
    messages,
    setMessages,
    fetchMessages,
    setFetchMessages,
    currentUser,
    setSelectedChat,
    setFetchUserChats,
    setShowGroupSettings,
    unreadMessages,
    setUnreadMessages,
    groupMembers,
    setGroupMembers,
  } = useContext(GlobalState);
  const [input, setInput] = useState("");

  useEffect(() => console.log(groupMembers), [groupMembers]);

  useEffect(() => {
    if (selectedChat?.type === "group") {
      (() => {
        axios
          .get(
            `${import.meta.env.VITE_URL}/api/groups/${
              selectedChat.info._id
            }/members`,
            {
              withCredentials: true,
            }
          )
          .then((res) => setGroupMembers(res.data.groupMembers))
          .catch((err) => console.log(err));
      })();
    }
  }, [selectedChat]);
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
            if (scrollContainer)
              scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 100);
          setMessages(res.data.messages);
          setFetchMessages(false);

          if (
            currentUser.unreadMessages.find(
              (msg) => msg.from === selectedChat.info._id
            ) &&
            !fetchMessages
          ) {
            const response = await axios.patch(
              `${import.meta.env.VITE_URL}/api/messages/read-unread-messages`,
              {
                userId: currentUser._id,
                senderId: selectedChat.info._id,
              },
              {
                withCredentials: true,
              }
            );

            if (response.data?.status === "success") {
              const index = unreadMessages?.findIndex(
                (msg) => msg.from === selectedChat.info._id
              );

              if (index !== -1) {
                setUnreadMessages((prev) => {
                  const newArray = [...prev];
                  newArray.splice(index, 1);
                  console.log(newArray);
                  return newArray;
                });
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (selectedChat || fetchMessages) fetchData();
  }, [selectedChat, fetchMessages]);

  const handeSendingMessage = () => {
    if (input !== "") {
      socket.emit("send-message", {
        message: input,
        to: selectedChat.info._id,
        type: selectedChat.type,
        format: "text",
      });
      setMessages((prev) => [
        ...prev,
        {
          message: input,
          sender: currentUser._id,
          receiver: selectedChat.info._id,
          timestamp: Date.now(),
        },
      ]);
      setFetchMessages(true);
      setInput("");
    }
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
    let fetch = false;
    messages.forEach((message) => {
      if (!message.deletedBy.includes(currentUser._id)) fetch = true;
    });
    if (messages.length === 0 || !fetch) return;
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
        setMessages([]);
        showAlert("Chats Deleted Successfully", "home");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUserRemovalFromChats = async (id, type) => {
    showAlert("Removing Contact", "home");
    const res = await axios({
      url: `${import.meta.env.VITE_URL}/api/users/removeContact/${type}/${id}`,
      method: "DELETE",
      withCredentials: true,
    });
    if (res.data.status === "success") {
      document.querySelector(".alert")?.remove();
      showAlert("Contact Removed Successfully", "home");
      setFetchUserChats(true);
      setSelectedChat(null);
    }
  };

  const handlePhotoUpload = async () => {
    const photo = document.getElementById("photo-message").files[0];
    const form = new FormData();
    form.append("photo-message", photo);
    const res = await axios({
      url: `${import.meta.env.VITE_URL}/api/messages/send-photo-message`,
      method: "POST",
      data: form,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    if (res.data?.status === "success") {
      socket.emit("send-message", {
        message: res.data.imageUrl,
        to: selectedChat.info._id,
        type: selectedChat.type,
        format: "photo",
      });
      setMessages((prev) => [
        ...prev,
        {
          message: res.data.imageUrl,
          sender: currentUser._id,
          receiver: selectedChat.info._id,
          timestamp: Date.now(),
          type: "photo",
        },
      ]);
    }
  };
  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/messages/delete-message/${messageId}`,
        {},
        { withCredentials: true }
      );
      if (res.data?.status === "success") {
        const deletedMessageIndex = messages.findIndex(
          (msg) => msg._id === messageId
        );
        const newMessages = [...messages];
        newMessages[deletedMessageIndex].message = "This message was deleted";
        newMessages[deletedMessageIndex].deleted = "true";

        setMessages(newMessages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = document.getElementById("scroll-container");
      if (scrollContainer)
        scrollContainer.scrollTop = scrollContainer?.scrollHeight;
    }, 100);
  }, [selectedChat]);

  return (
    selectedChat && (
      <div className="flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow relative w-svw xs:w-fit">
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
            {messages?.map((message,i) =>
              message?.deletedBy?.includes(currentUser._id) ? null : (
                <li
                  className={`text-sm flex flex-col relative ${
                    message.sender === currentUser._id
                      ? "self-end"
                      : "self-start "
                  } `}
                  id="message" key={i}
                >
                  {" "}
                  {message.type === "photo" && !message.deleted ? (
                    <img
                      src={`${import.meta.env.VITE_URL}/public/chats/${
                        message.message
                      }`}
                      alt="photo"
                      className="h-32 sm:h-60"
                    />
                  ) : (
                    <span
                      className={`pointer-events-none 
                        ${message.deleted ? "text-gray-500" : "text-[#333333]"}
                        ${
                          message.sender !== currentUser._id
                            ? "bg-[#E8F5E9] self-start rounded-bl-none"
                            : "bg-[#E0F7FA] self-end rounded-br-none"
                        } p-1 px-2 py-2 sm:p-3 text-xs sm:text-sm rounded-lg`}
                    >
                      {message.message}
                    </span>
                  )}
                  <span className="text-[10px] mt-[2px] pl-2 text-[#414141] font-nunito font-semibold flex justify-between items-center">
                    <span>
                      {message.sender !== currentUser._id
                        ? message.isGroupMessage
                          ? groupMembers?.find(
                              (user) => user._id === message.sender
                            ).name
                          : selectedChat.info.name
                        : null}{" "}
                      <span className="mx-1 text-[#b2b2b2] text-[8px] ">
                        {getFormattedDate(message.timestamp)}
                      </span>
                    </span>
                    {message.sender === currentUser._id && !message.deleted && (
                      <MdDelete
                        color="#b2b2b2"
                        className=" cursor-pointer"
                        onClick={() => handleDeleteMessage(message._id)}
                      />
                    )}
                  </span>
                </li>
              )
            )}
          </ul>
          <div className="sticky bottom-0  w-full  h-10  flex items-center mb-2 justify-center space-x-2">
            <input
              type="text"
              placeholder="type a message"
              className={`w-[60%] bg-[#e1dfdf5c] h-8 px-3 sm:px-5 sm:py-5 rounded-full text-sm outline-0 border-0 font-nunito font-medium ${
                selectedChat.type === "group" && !selectedChat.info.active
                  ? "cursor-not-allowed"
                  : null
              }`}
              id="message"
              disabled={
                selectedChat.type === "group" && !selectedChat.info.active
              }
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
                onChange={handlePhotoUpload}
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
                accept="image/*"
                name="photo-upload"
                className="w-full h-full opacity-0 absolute  "
                onChange={handlePhotoUpload}
                id="photo-message"
              />

              <SiFiles
                className="cursor-pointer w-full h-full "
                color="#333333"
              />
            </div>
          </div>
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
