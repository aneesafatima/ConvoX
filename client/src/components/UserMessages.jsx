import React , {useContext} from 'react'

import { GlobalState } from "../context/GlobalState";
import { RiPencilFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";

function UserMessages() {
    const {setSelectUser} = useContext(GlobalState)
  return (
    <aside className="border-r-2 h-svh w-1/4 rounded-e-lg pt-3 flex flex-col p-2  ">
      <button className="w-[100%] text-xs  px-1 py-2 flex justify-center items-center  rounded-lg bg-[#2c2c2c] hover:bg-black text-white font-lato" onClick={()=> setSelectUser(true)}>
        {" "}
        <RiPencilFill className="inline mr-1" size={19} /> New Message
      </button>
      <div>
        <span className="text-[11px] font-roboto text-[#2c2c2c]">
          Direct messages
        </span>

        <ul>
          <li className="text-xs flex items-center  font-semibold cursor-pointer hover:bg-[#e2e2e2] py-1 rounded-lg ">
            <FaUserCircle size={30} className="mx-1"/>
            arman ali
          </li>
          <li></li>
        </ul>
      </div>
    </aside>
  );
}

export default UserMessages;
