import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import axios from "axios";
import { ImExit } from "react-icons/im";
import { showAlert } from "../utils/showAlert";
import { IoMdSettings } from "react-icons/io";
import { Message, ReactTooltip, MessageInputBox } from ".";

import { HiUserRemove } from "react-icons/hi";

function Chats() {
  const {
    selectedChat,
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
    setGroupMembers,
  } = useContext(GlobalState);

  const [replyingMessage, setReplyingMessage] = useState(null);

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

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = document.getElementById("scroll-container");
      if (scrollContainer)
        scrollContainer.scrollTop = scrollContainer?.scrollHeight;
    }, 100);
  }, [selectedChat]);

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
