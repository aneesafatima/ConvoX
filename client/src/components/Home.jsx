import React, { useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import { showAlert } from "../utils/showAlert";

function Home() {
  //fix add members functionality
  //add group name change functionality
  //add search functionality for users and groups
  //add profile picture change feature
  //logout + delete account functionality
  //add loader
  const {
    giveAccess,
    seTGiveAccess,
    setCurrentUser,
    refetch,
    setRefetch,
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
  setUnreadMessages
  } = useContext(GlobalState);

  const [isConnected, setIsConnected] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (isConnected && currentUser && !socket) {
      console.log("RUNNING !!!!!");
      setSocket(
        io(`${import.meta.env.VITE_URL}`, {
          query: {
            userId: currentUser._id,
          },
          withCredentials: true,
        })
      );
      setIsConnected(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (refetch) {
      async function fetchData() {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/home`, {
            withCredentials: true,
          });

          if (res.data?.status === "success") {
            seTGiveAccess(true);
            setCurrentUser(res.data.user);
            setIsConnected(true);
            setShowErr(false);
            console.log(res.data)
            setUnreadMessages(res.data.user.unreadMessages);
          }
        } catch (err) {
          setShowErr({ status: true, message: err.message });
        }
        setRefetch(false);
      }
      fetchData();
    }
  }, [refetch]);

  useEffect(() => {
    if (socket && currentUser) {
      socket.on("connect", () => {
        console.log("Connected to the server with id : ", socket.id);
        socket.on("new-message", () => {
          setFetchMessages(true);
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
        socket.on("removed-from-group", ( groupName) => {
          showAlert(
            `You have been removed from the group ${groupName}`,
            "home"
          );
        });
        socket.on("group-deleted", (groupId) => {
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
        console.log("fetching contacts");
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
          console.log("Contacts fetched");
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
      <div className="w-screen flex space-x-10" id="home">
        <div className="w-1/4 md:w-1/5 ">
          <UserMessages contacts={contacts} groups={groups} />
          <SelectUser />
        </div>
        <Chats />
        {showGroupSettings && <GroupSettings />}
      </div>
    )
  );
}

export default Home;
