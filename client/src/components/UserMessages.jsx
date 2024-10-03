import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../context/GlobalState";
import { RiPencilFill } from "react-icons/ri";
import { Notification } from ".";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "primereact/fileupload";
import { ReactTooltip } from ".";
import axios from "axios";
import { handleImageUpload, getFormattedDate } from "../utils/helpers";
import { showAlert } from "../utils/showAlert";

function UserMessages({ contacts }) {
  const {
    setShowUsers,
    currentUser,
    setSelectedChat,
    setFetchUsers,
    unreadMessages,
    seTGiveAccess,
    setShowGroupSettings,
    setGroupMembers,
    lastMessage,
  } = useContext(GlobalState);

  const [imageUrl, setImageUrl] = useState(currentUser?.photo + ".jpeg");
  const [searchTerm, setSearchTerm] = useState("");
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
        seTGiveAccess(false);
      }, 1000);
    }
  };

  const lastMessageDetails = (contact) => {
    const details = lastMessage?.find((el) => el.contactId === contact._id);
    if (details === undefined) return {};
    return {
      ...details,
      message:
        details.message.length > 22
          ? details.message.substring(0, 22) + "..."
          : details.message,
    };
  };

  return (
    <aside
      className={`border-r-2 h-svh overflow-auto scrollbar relative rounded-e-lg pt-3 flex flex-col p-2 pb-5 `}
    >
      <button
        className="w-full xs:w-[20%] lg:w-[50%] text-xs  px-1 py-2 flex justify-center items-center  rounded-lg bg-[#2c2c2c] hover:bg-black text-white font-lato"
        onClick={() => {
          setFetchUsers(true);
          setShowUsers(true);
          setSelectedChat(null);
          setGroupMembers(null);
        }}
      >
        <RiPencilFill className="inline mr-1" size={19} /> New Message
      </button>
      <div className="text-xs flex items-center justify-between font-semibold cursor-pointer  py-1 rounded-lg ">
        <span className="flex items-center space-x-2">
          <div className="w-14 h-14 xs:w-12 xs:h-12  my-3 relative rounded-full ml-1">
            <img
              src={`${import.meta.env.VITE_CLOUDINARY_PROFILES_URL}/${imageUrl}`}
              alt="user profile photo"
              className=" rounded-full"
            />
            <FileUpload
              mode="basic"
              auto
              name="profile-picture"
              url={`${
                import.meta.env.VITE_URL
              }/api/users/updateProfilePicture/user/${currentUser?._id}`}
              accept="image/*"
              className="absolute bottom-0 right-0  text-center"
              id="photo-upload"
              onUpload={(res) => handleImageUpload(res, setImageUrl)}
              onBeforeSend={() => showAlert("Uploading image", "home")}
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
        <span className="text-[12px] font-roboto font-medium text-[#2c2c2c]">
          Direct messages
        </span>

        <input
          type="text"
          className=" h-7 my-2 rounded-lg w-full  bg-[#f2f2f2] block text-sm font-lato px-3 outline-none border-0"
          placeholder="search chat"
          id="user-name"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {!contacts ? (
          <span className="chats-loader"></span>
        ) : (
          <ul className="space-x-0">
            {contacts?.map(
              (contact, i) =>
                contact?.name.includes(searchTerm) && (
                  <li
                    className="text-xs flex items-center justify-between px-2  font-semibold cursor-pointer hover:bg-[#eaeaea] py-1 rounded-lg "
                    onClick={() => {
                      setSelectedChat({
                        info: contact,
                        type: contact.admin ? "group" : "individual",
                      });
                      setShowGroupSettings(false);
                    }}
                    id="contact"
                    key={i}
                  >
                    <span className="flex items-center w-full">
                      <img
                        src={`${import.meta.env.VITE_CLOUDINARY_PROFILES_URL}/${
                          contact.photo
                        }`}
                        className="mr-1 w-[46px] h-[46px] rounded-full"
                      />
                      <span className="flex flex-col w-full">
                        {contact?.name}
                        <span className=" items-center text-xs font-nunito text-[#777777] ">
                          {" "}
                          {lastMessageDetails(contact).message}
                          <span className="mx-2 text-[10px]">
                            {getFormattedDate(
                              lastMessageDetails(contact).timestamp
                            )}
                          </span>
                        </span>
                      </span>
                    </span>
                    <div className="bg-blue-500 min-w-3 max-w-fit rounded-full leading-3 text-center text-white font-nunito text-[7px]">
                      {
                        unreadMessages?.find((el) => el.from === contact._id)
                          ?.count
                      }
                    </div>
                  </li>
                )
            )}
          </ul>
        )}
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
