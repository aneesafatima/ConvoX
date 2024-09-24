import axios from "axios";
import {useContext, useCallback } from "react";
import { GlobalState } from "../context/GlobalState";
import { showAlert } from "./showAlert";

export const useGroupSettingsHandlers = (groupName) => {
  const {
    socket,
    setSelectedChat,
    setFetchUserChats,
    setGroupMembers,
    selectedChat,
    setShowGroupSettings,
  } = useContext(GlobalState);

  const handleRemoveGroupMember = useCallback(async (group, userId) => {
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
  }, []);

  const handleGroupDelete = useCallback(() => {
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
  },[selectedChat]);

  const handleGroupNameChange = useCallback(async () => {
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
  }, [selectedChat, groupName]);

  return { handleRemoveGroupMember, handleGroupDelete, handleGroupNameChange };
};
