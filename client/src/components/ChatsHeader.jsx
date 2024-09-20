import { ImExit } from "react-icons/im";
import { IoMdSettings } from "react-icons/io";
import { HiUserRemove } from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import { GlobalState } from "../context/GlobalState";
import { useChatHandlers } from "../utils/useChatHandlers";
import { IoChevronBackOutline } from "react-icons/io5";
import { useContext } from "react";
function ChatsHeader({ setShowFilesMessages }) {
  const { handleGroupExit, handleDeleteChats, handleUserRemovalFromChats } =
    useChatHandlers(); //called on every render abd uses this component's lifecycle

  const {
    selectedChat,
    setShowGroupSettings,
    currentUser,
    setSelectedChat,
    setMessages,
  } = useContext(GlobalState);
  return (
    <div className="flex justify-between items-center">
      <span className="flex items-center space-x-3">
        <IoChevronBackOutline
          size={20}
          className="cursor-pointer"
          onClick={() => {
            setSelectedChat(null);
            setShowFilesMessages(false);
            setMessages();
          }}
        />
        <h2 className="text-xl sm:text-2xl font-roboto font-semibold text-[#333333] ">
          Chats with {selectedChat.info.name}
        </h2>
      </span>
      <div className="flex items-center space-x-1">
        {selectedChat.type === "group" ? (
          <span className="flex items-center space-x-1 ">
            <IoMdSettings
              size={20}
              color="#333333 "
              className="cursor-pointer outline-none border-none"
              data-tooltip-id="settings-of-group"
              data-tooltip-content="settings"
              onClick={() => setShowGroupSettings(true)}
            />
            <ImExit
              size={16}
              color="#333333 "
              className="cursor-pointer outline-none border-none"
              data-tooltip-id="exit-group"
              data-tooltip-content="exit group"
              onClick={() =>
                handleGroupExit(currentUser._id, selectedChat.info._id)
              }
            />
          </span>
        ) : (
          <span className="flex items-center space-x-1">
            <HiUserRemove
              size={20}
              className="text-[#333333]  cursor-pointer outline-none border-none"
              data-tooltip-id="remove-contact"
              data-tooltip-content="remove contact"
              onClick={() =>
                handleUserRemovalFromChats(
                  selectedChat.info._id,
                  selectedChat.type === "group" ? "groupIds" : "contacts"
                )
              }
            />
            <MdDeleteForever
              size={20}
              className="text-[#333333]   cursor-pointer outline-none border-none"
              data-tooltip-id="delete-chats"
              data-tooltip-content="delete chats"
              onClick={() => handleDeleteChats(currentUser._id)}
            />
          </span>
        )}

        <IoMdInformationCircle
          color="#333333"
          className="cursor-pointer"
          data-tooltip-id="view-files"
          data-tooltip-content="View Files"
          size={18}
          onClick={() => setShowFilesMessages((prev) => !prev)}
        />
      </div>
    </div>
  );
}

export default ChatsHeader;
