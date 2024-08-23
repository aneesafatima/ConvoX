import React, { useEffect, useContext, useMemo, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import { showAlert } from "../utils/showAlert";

function Home() {
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
    setSelectUser,
    setFetchMessages
  } = useContext(GlobalState);

  const [isConnected, setIsConnected] = useState(false);

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

        socket.on("added-to-group", (user) => {
          showAlert(`${user.name} added you to the group`, "home");
          socket.emit("join-room", {roomId: `${user._id}-1`});
          setSelectUser(false);
        });
        socket.on("added-as-contact", (user) => {
          showAlert(`${user} added you as a contact`, "home");
          setSelectUser(false);
        });
      });
      return () => {
        console.log("User disconnected: ", socket.id);
        socket.disconnect(); //server removes this socket from the list of connected sockets
      };
    }
  }, [socket]);

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (refetch) {
    return <p> Loading... </p>;
  }

  return (
    giveAccess &&
    !refetch && (
      <div className="w-screen flex space-x-10" id="home">
        <div className="w-1/4 md:w-1/5 ">
          <UserMessages />
          <SelectUser />
        </div>
        <Chats />
      </div>
    )
  );
}

export default Home;
