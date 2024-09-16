import React, { useContext, useEffect, useState } from "react";
import { Chats, ErrComponent, UserMessages, GroupSettings } from ".";
import { GlobalState } from "../context/GlobalState";
import SelectUser from "./SelectUser";
import useSocket from "../utils/useSocket";
import useFetchData from "../utils/useFetchData";

function Home() {
  //unread messages bug + add some more refactoring
  //add jwt error hnadling in err middleware
  const {
    giveAccess,
    selectedChat,
    fetch,
    showErr,
    showGroupSettings,
    showUsers
  } = useContext(GlobalState);

  const [contacts, setContacts] = useState([]);


  useFetchData(setContacts);
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
          className={`w-svw xs:w-[300px] ${
            selectedChat && window.innerWidth <= 540 ? "hidden" : null
          }`}
        >
          <UserMessages contacts={contacts} />
        </div>
       {showUsers &&  <SelectUser contacts={contacts} />} 
        <Chats />
        {showGroupSettings && <GroupSettings />}
      </div>
    )
  );
}

export default Home;
