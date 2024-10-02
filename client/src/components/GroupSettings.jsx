import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { FaUserCircle } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { IoCheckboxSharp } from "react-icons/io5";
import { useGroupSettingsHandlers } from "../utils/useGroupSettingsHandlers";
import { ReactTooltip } from ".";
import { FileUpload } from "primereact/fileupload";
import {  handleImageUpload } from "../utils/helpers";
import { showAlert } from "../utils/showAlert";
function GroupSettings() {
  const {
    setShowGroupSettings,
    selectedChat,
    currentUser,
    setShowUsers,
    groupMembers,
  } = useContext(GlobalState);

  const [groupName, setGroupName] = useState(selectedChat?.info.name);
  const [groupImageUrl, setGroupImageUrl] = useState(selectedChat?.info.photo + ".jpeg");
  const { handleRemoveGroupMember, handleGroupDelete, handleGroupNameChange } =
    useGroupSettingsHandlers(groupName);
  useEffect(() => {
    if (selectedChat?.type === "group")
      setGroupImageUrl(selectedChat.info.photo);
  }, [selectedChat]);
  return (
    selectedChat &&
    <div className="absolute bg-[#f7f7f7] flex flex-col justify-between z-50 w-56 min-h-[35vh]  max-h-[80vh] overflow-auto rounded-lg  shadow-xl pt-2 pb-2 px-2  right-10 top-12">
      <RxCross1
        size={10}
        className="absolute top-3 right-4 cursor-pointer"
        onClick={() => setShowGroupSettings(false)}
      />
      <div>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-14 h-14 xs:w-12 xs:h-12  my-3 relative rounded-full ml-1">
            <img
              src={`${
                import.meta.env.VITE_CLOUDINARY_URL
              }/${groupImageUrl}`}
              alt="user profile photo"
              className=" rounded-full"
            />
            <FileUpload
              mode="basic"
              auto
              name="profile-picture"
              url={`${
                import.meta.env.VITE_URL
              }/api/groups/updateProfilePicture/group/${selectedChat?.info._id}`}
              accept="image/*"
              className="absolute bottom-0 right-0  text-center"
              id="photo-upload"
              onUpload={(res) => handleImageUpload(res, setGroupImageUrl)}
              onBeforeSend ={() => showAlert("Uploading image", "home")}
            />
          </div>
          <div className="flex flex-col ">
            <span className=" font-nunito flex items-center">
              <input
                className="font-lato font-semibold w-32 bg-transparent focus:p-1 outline-1 outline-gray-500 focus:text-xs"
                id="group-name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                minLength={40}
              />
              <IoCheckboxSharp
                size={17}
                className="check m-1 hidden"
                onClick={handleGroupNameChange}
              />
            </span>

            <span className="text-[10px]">
              {selectedChat?.info.description ?? "no description"}
            </span>
          </div>
        </div>
        <span className="font-lato text-xs text-[#282727] px-2">Members</span>

       { !groupMembers && <div className="loader"></div>}

        <ul className="space-y-2 px-2 mt-1">
       
          {groupMembers?.map((member) => (
            <li className="flex items-center ">
              <FaUserCircle size={30} />
              <div className="text-xs mx-2 flex justify-between items-center w-full">
                <span>{member.name}</span>
                <span className="text-[9px] text-[#a6a6a6]">
                  {member._id === selectedChat?.info.admin ? (
                    "admin"
                  ) : currentUser._id === selectedChat.info.admin ? (
                    <span
                      className="cursor-pointer hover:text-gray-600"
                      onClick={() =>
                        handleRemoveGroupMember(selectedChat.info, member._id)
                      }
                    >
                      remove
                    </span>
                  ) : null}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-[8px]  text-[#a6a6a6] font-nunito">
          created at{" "}
          {new Date(selectedChat.info.createdAt).toLocaleDateString()}
        </div>

        <div className="flex space-x-1">
          {selectedChat.info.admin === currentUser._id && (
            <AiFillDelete
              className="text-[#dc3545] cursor-pointer hover:text-red-700 outline-none border-none"
              data-tooltip-id="delete-group"
              data-tooltip-content="delete group"
              onClick={handleGroupDelete}
            />
          )}

          <MdAddCircle
            className="cursor-pointer text-[#28a745] hover:text-green-700 outline-none border-none"
            data-tooltip-id="add-user"
            data-tooltip-content="add user"
            onClick={() => {
              setShowUsers({ type: "addingGroupMembers" });
              setShowGroupSettings(false);
            }}
          />
        </div>
      </div>
      <ReactTooltip
        className="tooltip"
        id="delete-group"
        style={{ backgroundColor: "#dc3545" }}
      />
      <ReactTooltip
        className="tooltip"
        id="add-user"
        style={{ backgroundColor: "#28a745" }}
      />
    </div>
  );
}

export default GroupSettings;
