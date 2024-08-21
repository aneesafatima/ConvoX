import React, { useContext, useEffect, useState } from "react";

import { GlobalState } from "../context/GlobalState";
import { RiPencilFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

import axios from "axios";

function UserMessages() {
  const { setSelectUser, currentUser, selectUser, setSelectedUser } =
    useContext(GlobalState);
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    const fetchUserContacts = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/users/userContacts`,
        {
          withCredentials: true,
        }
      );
      if (res.data?.status === "success") setContacts(res.data.contactUsers);
    };
    if (!selectUser) fetchUserContacts();
  }, [selectUser]);

  const handleUserChat = (contact) => {
    setSelectedUser(contact);
  };
  return (
    <aside className="border-r-2 h-svh  rounded-e-lg pt-3 flex flex-col p-2  ">
      <button
        className="w-full sm:w-[50%] text-xs  px-1 py-2 flex justify-center items-center  rounded-lg bg-[#2c2c2c] hover:bg-black text-white font-lato"
        onClick={() => setSelectUser(true)}
      >
        <RiPencilFill className="inline mr-1" size={19} /> New Message
      </button>
      <div className="text-xs flex items-center  font-semibold cursor-pointer hover:bg-[#e2e2e2] py-1 rounded-lg ">
        <FaUserCircle size={30} className="mx-1" />
        {currentUser?.name}
      </div>
      <div>
        <span className="text-[11px] font-roboto text-[#2c2c2c]">
          Direct messages
        </span>

        <ul>
          {contacts?.map((contact) => (
            <li className="text-xs flex items-center  font-semibold cursor-pointer hover:bg-[#e2e2e2] py-1 rounded-lg " onClick={() => handleUserChat(contact)}>
              <FaUserCircle
                size={30}
                className="mx-1"
              />
              {contact?.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default UserMessages;
