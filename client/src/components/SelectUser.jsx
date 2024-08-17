import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";

import { GlobalState } from "../context/GlobalState";
function SelectUser() {
  const { selectUser } = useContext(GlobalState);
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
        <ul className=" ">
          <li className="text-sm flex items-center  font-semibold cursor-pointer hover:bg-[#e2e2e2] py-1 rounded-lg pl-1 ">
            <FaUserCircle size={35} className="mr-3" />
            arman ali
          </li>
        </ul>
      </div>
    )
  );
}

export default SelectUser;
