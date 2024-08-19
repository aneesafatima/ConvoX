import React, {useContext} from 'react'
import { GlobalState } from '../context/GlobalState'

function Chats() {
  const {selectedUser, socket} = useContext(GlobalState)
  const handeSendingMessage = () => {
    const message = document.getElementById('message').value
    console.log(message);
    socket.emit('send-message', {message, to: selectedUser._id})
  }
  return (
    selectedUser && 
    <div className='flex font-lato flex-col space-y-5 p-3 px-5 pb-4 flex-grow relative '>
      <h2 className='text-2xl font-roboto font-semibold '>Chats with {selectedUser.name}
        </h2>
        <div className='border rounded-lg w-full h-full overflow-auto flex flex-col'>
          <ul className='p-4 space-y-4'>
        <li className='text-sm bg-[#E0F7FA] w-fit p-3 rounded-lg rounded-bl-none'>
          Hey amanda are you around? ☺️
        </li>
        <li className='text-sm bg-[#E8F5E9] w-fit p-3 rounded-lg rounded-br-none float-right'>
        Yep, why?
        </li>
          </ul>
          <div className='absolute bottom-0 -translate-y-full w-[80%]  left-1/2 -translate-x-1/2  flex'>

         <input type="text" placeholder='type a message' className='w-full bg-[#f4f2f2] p-2 rounded-s-lg text-sm outline-0 border-0' id="message"/> 
         <button className='text-white font-roboto bg-[#2c2c2c] hover:bg-black rounded-e-lg px-2 text-sm' onClick={handeSendingMessage}>send</button>
          </div>
        </div>
    </div>
  )
}
//#E8F5E9

export default Chats
