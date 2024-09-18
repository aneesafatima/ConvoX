import axios from "axios";
import { useEffect, useContext, useCallback } from "react";
import { GlobalState } from "../context/GlobalState";
import { showAlert } from "./showAlert";

export const useChatHandlers = () => {
  const {
    setMessages,
    fetchMessages,
    setFetchMessages,
    setFetchUserChats,
    setSelectedChat,
    unreadMessages,
    setUnreadMessages,
    setGroupMembers,
    selectedChat,
    currentUser,
    messages,
  } = useContext(GlobalState);

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
        console.log("got selected chat", selectedChat);
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/messages/${selectedChat.type}/${
            selectedChat.info._id
          }`,
          { withCredentials: true }
        );
        if (res.data?.status === "success") {
          setMessages(res.data.messages);
          setFetchMessages(false);

          if (
            unreadMessages.find(
              (msg) => msg.from === selectedChat.info._id
            )
          ) {
            console.log("entered reading message state")
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

    if (selectedChat) fetchData();
  }, [selectedChat]);
  useEffect(() => {
    console.log("unreadMessages", unreadMessages), [unreadMessages];
  });
  const handleGroupExit = useCallback(
    async (userId, groupId) => {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_URL
        }/api/groups/removeGroupMember/${groupId}/${userId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.status === "success") {
        setTimeout(() => {
          setFetchUserChats(true);
          showAlert(
            `You have exited the group ${selectedChat.info.name}`,
            "home"
          );
          setSelectedChat(null);
        }, 500);
      }
    },
    [selectedChat]
  );

  const handleDeleteChats = useCallback(async () => {
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
  }, [messages]);

  const handleUserRemovalFromChats = useCallback(async (id, type) => {
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
  }, []);

  return {
    handleGroupExit,
    handleDeleteChats,
    handleUserRemovalFromChats,
  };
};
