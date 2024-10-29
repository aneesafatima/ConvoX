import { useContext } from "react";
import { GlobalState } from "../context/GlobalState";
import { showAlert } from "./showAlert";
import axios from "axios";

const chatCreation = (contacts) => {
  const {
    isGroup,
    selectedChat,
    setGroupMembers,
    setShowUsers,
    showUsers,
    setFetchUserChats,
    groupMembers,
    setIsGroup,
    currentUser,
    socket,
  } = useContext(GlobalState);

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
      if (
        showUsers?.type === "addingGroupMembers" &&
        groupMembers?.find((member) => member._id === selectedUser._id)
      ) {
        showAlert("User already added", "home");
        return;
      } else if (
        showUsers?.type !== "addingGroupMembers" &&
        contacts?.find((contact) => contact._id === selectedUser._id)
      )
        return showAlert("User already added", "home");

      setShowUsers(false);
      showAlert("Adding user...", "home");
      const res = await axios.patch(
        `${import.meta.env.VITE_URL}/api/users/${
          showUsers?.type === "addingGroupMembers" ? "group" : "personal"
        }/addUserContact/${selectedUser._id}`,
        {
          groupId:
            showUsers.type === "addingGroupMembers"
              ? selectedChat?.info._id
              : null,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data?.status === "success") {
        if (showUsers.type === "addingGroupMembers") {
          setGroupMembers((prev) => [...prev, selectedUser]);
        }
        socket.emit("added-new-user", {
          selectedUserId: selectedUser._id,
          userName: currentUser.name,
          groupId:
            showUsers.type === "addingGroupMembers"
              ? selectedChat.info._id
              : undefined,
          groupName:
            showUsers.type === "addingGroupMembers"
              ? selectedChat.info.name
              : undefined,
        });
        setFetchUserChats(true);

        showAlert("User added successfully", "home");
      }
    }
  };

  const handleGroupCreation = async () => {
    if (groupMembers?.length > 1) {
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
        showAlert(err.response.data.message, "home");
      }
    } else showAlert("Group must have atleast 2 members", "home");
  };

  return { handleUserSelction, handleGroupCreation };
};

export default chatCreation;
