import React, { useEffect, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import { showAlert } from "../utils/showAlert";

function Home() {
  //add group name change functionality
  //change the way uploaded files ae stored (their names)
  //add loader
  //fix profiles icons alignment
  //refactor

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
    setRefetch,
    setUnreadMessages,
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
     
          setRefetch(false);
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
        
          if (!selectedChatRef.current || selectedChatRef.current.info._id !== sender) {
            console.log("sender", sender);
            socket.emit("unread-message", {
              sender,
              receiver: currentUser._id,
            });
            setUnreadMessages((prev) => {
              const existingIndex = prev.findIndex(
                (item) => item.from === sender
              );
              console.log("existing Index", existingIndex);
              if (existingIndex !== -1) {
                const updatedUnreadMessages = [...prev];
                console.log(
                  "existing count : :",
                  updatedUnreadMessages[existingIndex].count
                );
                updatedUnreadMessages[existingIndex].count += 1;
                console.log(
                  "updated count : :",
                  updatedUnreadMessages[existingIndex].count
                );
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
        socket.on("group-deleted", () => {
          setFetchUserChats(true);
        });
      });

      return () => {
        console.log("User disconnected: ", socket.id);
        socket.disconnect(); //server removes this socket from the list of connected sockets
      };
    }
  }, [socket]);

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
          <SelectUser contacts={contacts} />
        </div>
        <Chats />
        {showGroupSettings && <GroupSettings />}
      </div>
    )
  );
}

export default Home;
