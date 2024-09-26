import React, { useContext, useEffect, useState } from "react";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import useSocket from "../utils/useSocket";
import useFetchData from "../utils/useFetchData";

function Home() {

  const {
    giveAccess,
    selectedChat,
    fetch,
    showErr,
    showGroupSettings,
    showUsers,
  } = useContext(GlobalState);

  const [contacts, setContacts] = useState();

  useFetchData(setContacts, contacts);
  useSocket();

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (fetch) {
    return (
      <div
        class="main-loader absolute top-1/2 -translate-y-1/2 left-1/2
     -translate-x-1/2"
      ></div>
    );
  }

  return (
    giveAccess &&
    !fetch && (
      <div className="w-screen flex " id="home">
        <div
          className={`w-svw lg:w-[300px] ${
            selectedChat && window.innerWidth <= 768 ? "hidden" : null
          }`}
        >
          <UserMessages contacts={contacts} />
        </div>
        {showUsers && <SelectUser contacts={contacts} />}
        <Chats setContacts={setContacts} />
        {showGroupSettings && <GroupSettings />}
      </div>
    )
  );
}

export default Home;
