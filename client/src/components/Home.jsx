import React, { useEffect, useContext, useMemo, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";

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
  } = useContext(GlobalState);

  const [isConnected, setIsConnected] = useState(false);

  const socket = useMemo(
    () => {
      if (isConnected && currentUser) {
        return io(`${import.meta.env.VITE_URL}`, {
          query: {
            userId: currentUser._id,
          },
          withCredentials: true,
        });
      }
    },
    [isConnected, currentUser] // the io method returns a socket instance; this instance then helps in connecting to the server, listening for events emitted by server, sending/receiving messages and emitting events to server
  );
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
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to the server with id : ", socket.id);
      });
    }

    return () => {
      if (socket) {
        console.log("User disconnected: ", socket.id);
        socket.disconnect(); //server removes this socket from the list of connected sockets
      }
    };
  }, [isConnected]);

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (refetch) {
    return <p> Loading... </p>;
  }

  return (
    giveAccess &&
    !refetch && (
      <div className="w-full flex">
        <div className="w-full">
          <UserMessages />
          <SelectUser />
        </div>
        <Chats />
      </div>
    )
  );
}

export default Home;
