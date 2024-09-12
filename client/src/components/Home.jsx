import React, { useEffect, useContext, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import { showAlert } from "../utils/showAlert";
import useSocket from "../utils/useSocket";
import useFetchData from "../utils/useFetchData";

function Home() {
  //fix connect bug + unread messages bug
  // profile pic of groups
  //fix styling issues of chats
  //add view images and file showing feature
  //fix reply design
  //add loader
  //refactor of selectUser + server index.js
  //add last messasge in chat
  //improve error handlimg + cookies tag
  //fix map async problem
  const {
    giveAccess,
    selectedChat,
    fetch,
    showErr,
    showGroupSettings,
  } = useContext(GlobalState);

  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);

  useFetchData(setContacts, setGroups);
  useSocket();

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (fetch) {
    return <p> Loading... </p>;
  }

  return (
    giveAccess &&
    !fetch && (
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
