import React, { useContext, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

import { GlobalState } from "../context/GlobalState";
function SelectUser() {
  const { selectUser, setAllUsers, allUsers, currentUser , setSelectUser} =
    useContext(GlobalState);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/users`, {
          withCredentials: true,
        });
        if (res.data?.status === "success") {
          setAllUsers(res.data.users);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);


  const handleUserSelction = async(selectedUser) => {
  
  const res = await axios.post(`${import.meta.env.VITE_URL}/api/users/addUserContact`, {
    userContacted: selectedUser._id
  }, {
    withCredentials: true
  })
  if(res.data?.status === "success"){
    setSelectUser(false);
    console.log("Successfully addeds new contact")
  }

  };
  return (
    selectUser && (
      <div className="bg-blue-100 absolute w-[500px] h-[600px]  rounded-lg -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 py-4 px-10 space-y-4">
        <div className=" flex">
          <input
            type="text"
            className="w-[90%] h-8 rounded-s-lg bg-white block text-sm font-lato px-3 outline-none border-0"
            placeholder="select user"
          />
          <button className="w-14 bg-blue-400 rounded-e-lg text-xs font-lato  text-white hover:bg-blue-500">
            GO
          </button>
        </div>
        <ul className=" flex flex-col space-y-3">
          {allUsers?.map(
            (user) =>
              user._id !== currentUser?._id && (
                <li
                  className={`text-sm flex items-center justify-between font-semibold ${
                    user.active
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  } hover:bg-[#e2e2e2] py-1 rounded-lg pl-1 px-6 `}
                  onClick={() => handleUserSelction(user)}
                >
                  <span className="flex items-center">
                    <FaUserCircle size={35} className="mr-3" />
                    {user.name}
                  </span>
                  <span className={`${user.active ? "bg-green-700" : "bg-red-700"} w-2 h-2 rounded-full`}></span>
                </li>
              )
          )}
        </ul>
      </div>
    )
  );
}

export default SelectUser;
