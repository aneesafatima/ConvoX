import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { GlobalState } from "../context/GlobalState";
import { showAlert } from "../utils/showAlert";

function SelectUser({contacts}) {
  const {
    allUsers,
    currentUser,
    setFetchUserChats,
    showUsers,
    setShowUsers,
    isGroup,
    setIsGroup,
    groupMembers,
    setGroupMembers,
    selectedChat,
    socket,
  } = useContext(GlobalState);
  const [searchTerm, setSearchTerm] = useState("");

  const userArray =
    showUsers?.type === "addingGroupMembers"
      ? allUsers.filter(
          (user) => !groupMembers.find((member) => member._id === user._id)
        )
      : allUsers;

  const handleUserSelction = async (selectedUser) => {
    if (isGroup) {
      if (groupMembers?.includes(selectedUser)) {
        showAlert("User already added", "home");
        return;
      }
      setGroupMembers((prev) => {
        const groupArray = prev ? [...prev, selectedUser] : [selectedUser];
        return groupArray;
      });
    } else {
      setShowUsers(false);
      console.log(currentUser)
      if(contacts?.includes(selectedUser._id)){ showAlert("User already added", "home"); return ;}
      showAlert("Adding user...", "home");
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/users/${
          showUsers?.type === "addingGroupMembers" ? "group" : "personal"
        }/addUserContact/${selectedUser._id}`,
        {
          groupId:
            showUsers.type === "addingGroupMembers"
              ? selectedChat.info._id
              : null,
        },
        {
          withCredentials: true,
        }
      );
     
      if (res.data?.status === "success") {
        if (showUsers.type === "addingGroupMembers") {
        } else {
          socket.emit("added-new-user", {
            selectedUserId: selectedUser._id,
            userName: currentUser.name,
          });
          setFetchUserChats(true);
        }

        showAlert("User added successfully", "home");
      }
    }
  };

  const handleGroupCreation = async () => {
    if (groupMembers.length > 1) {
      setGroupMembers((prev) => [...prev, currentUser]);

      try {
        const groupMembersIds = [...groupMembers, currentUser].map(
          (member) => member._id
        );
        const res = await axios({
          url: `${import.meta.env.VITE_URL}/api/groups`,
          data: {
            name: document.getElementById("group-name").value,
            description: document.getElementById("group-description").value,
            groupMembers: groupMembersIds,
          },
          method: "POST",
          withCredentials: true,
        });
        if (res.data.status === "success") {
          showAlert("Group created successfully", "home");
          socket.emit("group-creation", {
            userName: currentUser.name,
            groupId: res.data.group._id,
            groupName: res.data.group.name,
            groupMembersIds,
          });
          setGroupMembers([]);
          setFetchUserChats(true);
          setShowUsers(false);
          setIsGroup(false);
        }
      } catch (err) {
        showAlert("Group creation failed", "home");
      }
    } else showAlert("Group must have atleast 2 members", "home");
  };

  const handleRemoveGroupMember = (i) => {
    const newGroupMembers = [...groupMembers];
    newGroupMembers.splice(i, 1);
    setGroupMembers(newGroupMembers);
  };
  return (
    showUsers && (
      <div className="bg-blue-100 absolute z-40 w-[500px] h-[600px]  rounded-lg -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 py-4 px-10 space-y-4">
        <RxCross1
          className="absolute right-6 top-6 cursor-pointer"
          size={10}
          onClick={() => setShowUsers(false)}
        />
        <div className=" flex-col pt-6 space-y-3">
          <div className="flex">
            <input
              type="text"
              className="w-[90%] h-8 rounded-lg  bg-white block text-sm font-lato px-3 outline-none border-0"
              placeholder="search user"
              id="user-name"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isGroup ? (
              <IoCheckmarkDoneCircle
                size={30}
                color="white"
                className="cursor-pointer rounded-full w-fit h-fit p-1 bg-blue-400 hover:bg-blue-500 mx-2 "
                onClick={handleGroupCreation}
              />
            ) : (
              <MdOutlineGroups
                size={30}
                color="white"
                className="cursor-pointer rounded-full w-fit h-fit p-1 bg-blue-400 hover:bg-blue-500 mx-2 "
                onClick={() => setIsGroup(true)}
              />
            )}
          </div>
          {isGroup && (
            <>
              <input
                type="text"
                className="w-[60%] h-8 rounded-lg bg-white block text-sm font-lato px-3 outline-none border-0"
                placeholder="group name"
                id="group-name"
              />
              <input
                type="text"
                className="w-[60%] h-8 rounded-lg bg-white block text-sm font-lato px-3 outline-none border-0"
                placeholder="description"
                id="group-description"
              />
              <ul className="  rounded-lg  text-sm flex space-x-2">
                {groupMembers?.map((member, i) => (
                  <li
                    className="font-nunito  font-medium h-fit px-3 py-1 text-sm rounded-full bg-[#e3e3e3]"
                    key={i}
                  >
                    {member.name}{" "}
                    <RxCross1
                      className="inline cursor-pointer"
                      size={10}
                      onClick={() => handleRemoveGroupMember(i)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <ul className=" flex flex-col space-y-3">
          {userArray?.map(
            (user, i) =>
              user._id !== currentUser?._id &&
              user.name.includes(searchTerm) && (
                <li
                  className={`text-sm flex items-center justify-between font-semibold font-roboto cursor-pointer hover:bg-[#e2e2e2] py-1 rounded-lg pl-1 px-6 `}
                  onClick={() => handleUserSelction(user)}
                  key={i}
                >
                  <span className="flex text-xs">
                    <FaUserCircle size={35} className="mr-3" />
                    <span className="flex flex-col">
                      <span className="">{user.name}</span>
                      <span className="text-[9px] font-normal">
                        {user.email}
                      </span>
                    </span>
                  </span>
                  <span
                    className={`${
                      user.active ? "bg-green-700" : "bg-red-700"
                    } w-2 h-2 rounded-full`}
                  ></span>
                </li>
              )
          )}
        </ul>
      </div>
    )
  );
}

export default SelectUser;
