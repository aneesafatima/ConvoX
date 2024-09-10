import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { showAlert } from "../utils/showAlert";
import { RxCross1 } from "react-icons/rx";
import { IoCheckboxSharp } from "react-icons/io5";
import axios from "axios";
import { ReactTooltip } from ".";
function GroupSettings() {
  const {
    setShowGroupSettings,
    selectedChat,
    currentUser,
    setShowUsers,
    setSelectedChat,
    setFetchUserChats,
    groupMembers,
    setGroupMembers,
    socket,
  } = useContext(GlobalState);

  const [groupName, setGroupName] = useState(selectedChat?.info.name);
  const handleRemoveGroupMember = async (group, userId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/api/groups/removeGroupMember/${
          group._id
        }/${userId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        showAlert("Member Removed Successfully", "home");
        socket.emit("group-member-removed", {
          groupId: group._id,
          groupName: group.name,
          userId,
        });
        setGroupMembers((prev) => [
          ...prev.filter((member) => member._id !== userId),
        ]);
      }
    } catch (err) {
      showAlert(err.response?.data.message, "home");
    }
  };

  const handleGroupDelete = () => {
    axios
      .patch(
        `${import.meta.env.VITE_URL}/api/groups/${selectedChat.info._id}`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          socket.emit("group-deleted", {
            groupId: selectedChat.info._id,
            groupName: selectedChat.info.name,
          });
          showAlert("Group Deleted Successfully", "home");
          setShowGroupSettings(false);
          setSelectedChat(null);
          setFetchUserChats(true);
        }
      })
      .catch((err) => {
        showAlert(err.response?.data.message, "home");
      });
  };

  const handleGroupNameChange = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/groups/updateGroupName/${
          selectedChat.info._id
        }`,
        { name: groupName },
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        showAlert("Group Name Updated Successfully", "home");
        setFetchUserChats(true);
        socket.emit("group-name-updated", {
          groupId: selectedChat.info._id,
        });
      }
    } catch (err) {
      showAlert(err.response?.data.message, "home");
    }
  };

  return (
    <div className="absolute bg-[#f7f7f7] flex flex-col justify-between z-50 w-56 min-h-[35vh]  max-h-[80vh] overflow-auto rounded-lg  shadow-xl pt-2 pb-2 px-2  right-10 top-12">
      <RxCross1
        size={10}
        className="absolute top-3 right-4 cursor-pointer"
        onClick={() => setShowGroupSettings(false)}
      />
      <div>
        <div className="flex items-center space-x-2 mt-2">
          <RiGroup2Fill size={70} />
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
        <ul className="space-y-2 px-2 mt-1">
          {groupMembers?.map((member) => (
            <li className="flex items-center ">
              <FaUserCircle size={30} />
              <div className="text-xs mx-2 flex justify-between items-center w-full">
                <span>{member.name}</span>
                <span className="text-[9px] text-[#a6a6a6]">
                  {member._id === selectedChat.info.admin ? (
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
