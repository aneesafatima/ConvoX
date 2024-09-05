import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { RiPencilFill, RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { Notification } from ".";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { ReactTooltip } from ".";

import axios from "axios";
import { showAlert } from "../utils/showAlert";

function UserMessages({ contacts, groups }) {
  const {
    setShowUsers,
    currentUser,
    setSelectedChat,

    setFetchUsers,
   
    unreadMessages,
    setShowGroupSettings,
  } = useContext(GlobalState);
  const [imageUrl, setImageUrl] = useState(currentUser?.photo);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_URL}/api/users/logout`,
      { withCredentials: true }
    );
    if (res.data.status === "success") {
      showAlert("logging out", "home");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };
  const handleImageUpload = (res) => {
   setImageUrl(JSON.parse(res.xhr.response).imageUrl);
  };
  useEffect(() => {
    console.log(imageUrl);
  }, [imageUrl]);
  return (
    <aside className="border-r-2 h-svh relative rounded-e-lg pt-3 flex flex-col p-2  ">
      <button
        className="w-full sm:w-[50%] text-xs  px-1 py-2 flex justify-center items-center  rounded-lg bg-[#2c2c2c] hover:bg-black text-white font-lato"
        onClick={() => {
          setFetchUsers(true);
          setShowUsers(true);
        }}
      >
        <RiPencilFill className="inline mr-1" size={19} /> New Message
      </button>
      <div className="text-xs flex items-center justify-between font-semibold cursor-pointer  py-1 rounded-lg ">
        <span className="flex items-center space-x-2">
          <div className="w-8 h-8  relative rounded-full ml-1">
            <img
              src={`${import.meta.env.VITE_URL}/public/users/${imageUrl}`}
              alt="user profile photo"
              className="rounded-full"
            />
            <FileUpload
              mode="basic"
              auto
              name="profile-picture"
              url={`${
                import.meta.env.VITE_URL
              }/api/users/updateProfilePicture/${currentUser._id}`}
              accept="image/*"
              className="absolute bottom-0 right-0  text-center"
              id="photo-upload"
              onUpload={handleImageUpload}
            />
          </div>
          <span>{currentUser?.name}</span>
        </span>
        <TbLogout
          size={15}
          className="mx-3 outline-none border-none"
          onClick={handleLogOut}
          data-tooltip-id="log-out"
          data-tooltip-content="Log out"
        />
      </div>
      <div>
        <span className="text-[11px] font-roboto text-[#2c2c2c]">
          Direct messages
        </span>

        <ul>
          {contacts?.map((contact, i) => (
            <li
              className="text-xs flex items-center justify-between px-2  font-semibold cursor-pointer hover:bg-[#eaeaea] py-1 rounded-lg "
              onClick={() => {
                setSelectedChat({ info: contact, type: "individual" });
                setShowGroupSettings(false);
              }}
              id="user"
              key={"contact" + i}
            >
              <span className="flex items-center">
                <img src={`${import.meta.env.VITE_URL}/public/users/${contact.photo}`} className="mr-1 w-7 h-7 rounded-full"  />
                {contact?.name}
              </span>
              <div className="bg-blue-500 min-w-3 max-w-fit rounded-full leading-3 text-center text-white font-nunito text-[7px]">
                {unreadMessages?.find((el) => el.from === contact._id)?.count}
              </div>
            </li>
          ))}
          {groups?.map(
            (group, i) =>
              group.active && (
                <li
                  className="text-xs flex px-2 items-center justify-between font-semibold cursor-pointer hover:bg-[#eaeaea] py-1 rounded-lg "
                  key={"group" + i}
                  id="user"
                  onClick={() =>
                    setSelectedChat({ info: group, type: "group" })
                  }
                >
                  <span className="flex items-center">
                    <RiGroup2Fill size={33} className="mr-1"  />
                    {group?.name}
                  </span>
                  <div className="bg-blue-500 min-w-3 max-w-fit rounded-full leading-3 text-center text-white font-nunito text-[7px]">
                    {unreadMessages?.find((el) => el.from === group._id)?.count}
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
      <ReactTooltip
        className="tooltip"
        id="log-out"
        style={{ backgroundColor: "#ef4444 " }}
      />
      <Notification />
    </aside>
  );
}

export default UserMessages;
