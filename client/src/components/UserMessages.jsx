import React, { useContext } from "react";
import { AiFillMinusCircle   } from "react-icons/ai";
import { GlobalState } from "../context/GlobalState";
import { RiPencilFill, RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { Notification } from ".";


import axios from "axios";


function UserMessages({ contacts, groups }) {
  const { setShowUsers, currentUser, setSelectedChat,selectedChat,  setFetchUsers, setFetchUserChats } =
    useContext(GlobalState);

    const handleUserRemovalFromChats = async (id, type) => {
      const res = await axios({
      url: `${import.meta.env.VITE_URL}/api/users/removeContact/${type}/${id}`,
      method: 'DELETE',
      withCredentials: true,
      });
      if(res.data.status === "success"){
        setFetchUserChats(true);
        if(selectedChat?.info._id === id){
          setSelectedChat(null);
        }
    }
  }
  return (
    <aside className="border-r-2 h-svh  rounded-e-lg pt-3 flex flex-col p-2  ">
      <button
        className="w-full sm:w-[50%] text-xs  px-1 py-2 flex justify-center items-center  rounded-lg bg-[#2c2c2c] hover:bg-black text-white font-lato"
        onClick={() => {
          setFetchUsers(true);
          setShowUsers(true);
        }}
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
          {contacts?.map((contact, i) => (
            <li
              className="text-xs flex items-center justify-between px-2  font-semibold cursor-pointer hover:bg-[#eaeaea] py-1 rounded-lg "
              onClick={() =>
                setSelectedChat({ info: contact, type: "individual" })
              }
              id="user"
              key={"contact" + i}
            >
              <span className="flex items-center">

              <FaUserCircle size={30} className="mx-1" />
              {contact?.name}
              </span>

              <AiFillMinusCircle  size={12} className="text-red-700 user-remove-icon hidden" onClick={() => handleUserRemovalFromChats(contact._id, "contacts")}/>
            </li>
          ))}
          {groups?.map((group, i) => (
            <li
              className="text-xs flex px-2 items-center justify-between font-semibold cursor-pointer hover:bg-[#eaeaea] py-1 rounded-lg "
              key={"group" + i} id="user"
              onClick={() => setSelectedChat({ info: group, type: "group" })}
            >
              <span className="flex items-center">

              <RiGroup2Fill size={30} className="mx-1" />
              {group?.name}
              </span>
              <AiFillMinusCircle  size={12} className="text-red-700 user-remove-icon hidden" onClick={() => handleUserRemovalFromChats(group._id, "groupIds")}/>
            </li>
          ))}
        </ul>
      </div>
      <Notification/>
    </aside>
  );
}

export default UserMessages;
