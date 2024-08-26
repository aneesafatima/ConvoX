import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../context/GlobalState";
import { RiGroup2Fill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { MdAddCircle } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { showAlert } from "../utils/showAlert";
import axios from "axios";
import { ReactTooltip } from ".";
function GroupSettings() {
  const { setShowGroupSettings, selectedChat, allUsers, currentUser, setShowUsers, setSelectedChat } =
    useContext(GlobalState);
  const [groupMembers, setGroupMembers] = useState([]);
  useEffect(() => {
    setGroupMembers(
      allUsers.filter((user) => user.groupIds?.includes(selectedChat.info._id))
    );
  }, []);
  const handleRemoveGroupMember = async (groupId, userId) => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_URL
        }/api/groups/removeGroupMember/${groupId}/${userId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        showAlert("Member Removed Successfully", "home");
        setGroupMembers((prev) => [
          ...prev.filter((member) => member._id !== userId),
        ]);
      }
    } catch (err) {
      showAlert(err.response?.data.message, "home");
    }
  };

  const handleGroupDelete =  () => {
    axios
      .delete(
        `${import.meta.env.VITE_URL}/api/groups/${selectedChat.info._id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          showAlert("Group Deleted Successfully", "home");
          setShowGroupSettings(false);
          setSelectedChat(null);
        }
      })
      .catch((err) => {
        showAlert(err.response?.data.message, "home");
      });
  }

  return (
    <div className="absolute flex flex-col justify-between z-50 w-56 min-h-[35vh]  max-h-[80vh] overflow-auto rounded-lg bg-white shadow-xl pt-5 pb-2 px-2  right-10 top-12">
      <div>
        <div className="flex items-center space-x-2">
          <RiGroup2Fill size={70} />
          <div className="flex flex-col">
            <span className="font-lato font-semibold">
              {selectedChat.info.name}
            </span>
            <span className="text-[10px] font-nunito">
              {" "}
              {selectedChat.info.description ?? "no description"}
            </span>
          </div>
        </div>
        <span className="font-lato text-sm text-[#282727]">Members</span>
        <ul className="space-y-2 px-2 mt-1">
          {groupMembers.map((member) => (
            <li className="flex items-center ">
              <FaUserCircle size={25} />
              <div className="text-xs mx-2 flex justify-between items-center w-full">
                <span>{member.name}</span>
                <span className="text-[9px] text-[#a6a6a6]">
                  {member._id === selectedChat.info.admin ? (
                    "admin"
                  ) : currentUser._id === selectedChat.info.admin ? (
                    <span
                      className="cursor-pointer hover:text-gray-600"
                      onClick={() =>
                        handleRemoveGroupMember(
                          selectedChat.info._id,
                          member._id
                        )
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
      <div className="flex items-center justify-between">
        <div className="text-[8px] flex flex-col h-fit text-[#a6a6a6] font-nunito">
          <span>
            created at{" "}
            {new Date(selectedChat.info.createdAt).toLocaleDateString()}
          </span>

          <span>
            by{" "}
            {
              groupMembers.find(
                (member) => member._id === selectedChat.info.admin
              )?.name
            }
          </span>
        </div>
        <div className="flex space-x-1">
          <MdAddCircle
            className="cursor-pointer text-[#28a745] hover:text-green-700 outline-none border-none"
            data-tooltip-id="add-user"
            data-tooltip-content="add user"
            onClick={() => {setShowUsers({type: "addingGroupMembers"}); setShowGroupSettings(false)}}
          />

          <AiFillDelete
            className="text-[#dc3545] cursor-pointer hover:text-red-700 outline-none border-none"
            data-tooltip-id="delete-group"
            data-tooltip-content="delete group"
            onClick={handleGroupDelete}
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
