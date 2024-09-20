import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { GlobalState } from "../context/GlobalState";
import useChatCreation from "../utils/useChatCreation";

function SelectUser({ contacts }) {
  let userArray;
  const {
    allUsers,
    currentUser,
    showUsers,
    setShowUsers,
    isGroup,
    setIsGroup,
    groupMembers,
    setGroupMembers,
    setAllUsers,
    fetchUsers,
    setFetchUsers,
  } = useContext(GlobalState);
  const [searchTerm, setSearchTerm] = useState("");
  const { handleGroupCreation, handleUserSelction } = useChatCreation(contacts);

  if (showUsers && allUsers)
    userArray =
      showUsers?.type === "addingGroupMembers"
        ? allUsers.filter(
            (user) => !groupMembers.find((member) => member._id === user._id)
          )
        : allUsers;
  useEffect(() => {
    if (fetchUsers) {
      (async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/users`, {
            withCredentials: true,
          });
          if (res.data?.status === "success") {
            setAllUsers(res.data.users);
            setFetchUsers(false);
          }
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [fetchUsers]);

  const handleRemoveGroupMember = (i) => {
    const newGroupMembers = [...groupMembers];
    newGroupMembers.splice(i, 1);
    setGroupMembers(newGroupMembers);
  };

  return (
    <div className="bg-[#f7f7f7] shadow-md absolute overflow-auto scrollbar z-20 w-[300px] h-[350px]  xs:w-[400px] xs:h-[400px]  rounded-lg -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 pb-3 xs:py-4 px-5 xs:px-10 space-y-4">
      {!userArray && (
        <div
          className="main-loader absolute top-1/2 -translate-y-1/2 left-1/2
-translate-x-1/2"
        ></div>
      )}
      <RxCross1
        className="absolute right-6 top-6 cursor-pointer"
        size={10}
        onClick={() => {
          setShowUsers(false);
          setIsGroup(false);
        }}
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
              size={22}
              color="white"
              className="cursor-pointer rounded-full w-fit h-fit p-1 bg-blue-400 hover:bg-blue-500 mx-2 "
              onClick={handleGroupCreation}
            />
          ) : (
            <MdOutlineGroups
              size={22}
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
            <ul className="  rounded-lg  flex-wrap text-sm flex ">
              {groupMembers?.map((member, i) => (
                <li
                  className="font-nunito  font-medium h-fit my-2 mx-1 px-3 py-1 text-sm rounded-full bg-[#e3e3e3]"
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
                    <span className="text-[9px] font-normal">{user.email}</span>
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
  );
}

export default SelectUser;
