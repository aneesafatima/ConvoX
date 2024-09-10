import React, { useEffect, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import { showAlert } from "../utils/showAlert";

function Home() {
  //fix connect bug + unread messages bug
  // profile
  //add view images and file showing feature
  //fix reply design
  //add loader
  //refactor
  //add last messasge in chat
  //improve error handlimg + cookies tag
  //fix map async problem
  const {
    giveAccess,
    seTGiveAccess,
    setCurrentUser,
    selectedChat,
    refetch,
    setShowErr,
    showErr,
    currentUser,
    socket,
    setSocket,
    fetchUserChats,
    setFetchMessages,
    setFetchUserChats,
    setAllUsers,
    showGroupSettings,
    fetchUsers,
    setFetchUsers,
    setFetch,
    setUnreadMessages,
    setSelectedChat,
    showUsers,
  } = useContext(GlobalState);

  // Ref to track the current selectedChat
  const selectedChatRef = useRef(selectedChat);

  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (currentUser && !socket) {
      setSocket(
        io(`${import.meta.env.VITE_URL}`, {
          query: {
            userId: currentUser._id,
          },
          withCredentials: true,
        })
      );
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/home`, {
          withCredentials: true,
        });
        if (res.data?.status === "success") {
          seTGiveAccess(true);
          setCurrentUser(res.data.user);
          console.log("currentUser", res.data.user);
          setFetch(false);
          setUnreadMessages(res.data.user.unreadMessages);
        }
      } catch (err) {
        setShowErr({ status: true, message: err.message });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to the server with id : ", socket.id);
        socket.on("new-message", (sender) => {
          if (
            !selectedChatRef.current ||
            selectedChatRef.current.info._id !== sender
          ) {
            console.log("sender", sender);
            socket.emit("unread-message", {
              sender,
              receiver: currentUser._id,
            });
            setUnreadMessages((prev) => {
              const existingIndex = prev.findIndex(
                (item) => item.from === sender
              );

              if (existingIndex !== -1) {
                const updatedUnreadMessages = [...prev];
                updatedUnreadMessages[existingIndex].count += 1;
                return updatedUnreadMessages;
              } else return [...prev, { from: sender, count: 1 }];
            });
          } else setFetchMessages(true);
        });

        socket.on("added-to-group", ({ userName, groupId, groupName }) => {
          showAlert(`${userName} added you to the group ${groupName}`, "home");
          socket.emit("join-room", { roomId: groupId });
          setFetchUserChats(true);
        });

        socket.on("added-as-contact", (user) => {
          showAlert(`${user} added you as a contact`, "home");
          setFetchUserChats(true);
        });
        socket.on("removed-from-group", (groupName) => {
          showAlert(
            `You have been removed from the group ${groupName}`,
            "home"
          );
        });

        socket.on("group-name-updated", () => {
          console.log("group name updated");
          setFetchUserChats(true);
        });

        socket.on("group-deleted", (groupId) => {
          setFetchUserChats(true);
          if (selectedChatRef.current?.info._id === groupId) {
            setFetchMessages(true);
            setSelectedChat(null);
          }
        });

        socket.on("added-new-grp-member", (groupId) => {
      
          if(selectedChatRef.current?.info._id === groupId)
          setSelectedChat(prev => {return {...prev}})
        })
      });

      return () => {
        console.log("User disconnected: ", socket.id);
        socket.disconnect(); //server removes this socket from the list of connected sockets
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log("showUsers", showUsers);
  }, [showUsers]);

  useEffect(() => {
    if (fetchUserChats) {
      (async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/users/userContacts`,
          {
            withCredentials: true,
          }
        );
        if (res.data?.status === "success") {
          setContacts(res.data.contactUsers);
          setGroups(res.data.groups);
          setFetchUserChats(false);
        }
      })();
    }
  }, [fetchUserChats]);

  useEffect(() => {
    if (fetchUsers) {
      (async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/users`, {
            withCredentials: true,
          });
          if (res.data?.status === "success") {
            setAllUsers(res.data.users);
            setFetchUsers(false);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [fetchUsers]);

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (refetch) {
    return <p> Loading... </p>;
  }

  return (
    giveAccess &&
    !refetch && (
      <div className="w-screen flex " id="home">
        <div
          className={`w-svw xs:w-[300px] ${
            selectedChat && window.innerWidth <= 540 ? "hidden" : null
          }`}
        >
          <UserMessages contacts={contacts} groups={groups} />
        </div>
        <SelectUser contacts={contacts} />
        <Chats />
        {showGroupSettings && <GroupSettings />}
      </div>
    )
  );
}

export default Home;
