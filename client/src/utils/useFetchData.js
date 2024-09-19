import { useEffect, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../context/GlobalState";
import { RiCoinsLine } from "react-icons/ri";

const useFetchData = (setContacts, contacts) => {
  const {
    seTGiveAccess,
    setCurrentUser,
    setFetch,
    setUnreadMessages,
    setShowErr,
    fetchUserChats,
    setFetchUserChats,
    setLastMessage,
    lastMessage,
    giveAccess,
  } = useContext(GlobalState);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/home`, {
          withCredentials: true,
        });
        if (res.data?.status === "success") {
          setCurrentUser(res.data.user);
          setFetch(false);
          seTGiveAccess(true);
          setUnreadMessages(res.data.user.unreadMessages);
        }
      } catch (err) {
        setFetch(false);
        setShowErr({ status: true, message: err.response?.data.message });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchUserChats && giveAccess) {
      (async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/users/userContacts`,
          {
            withCredentials: true,
          }
        );
        if (res.data?.status === "success") {
          console.log("fetching chats again")
          const response = await axios.get(
            `${import.meta.env.VITE_URL}/api/messages/last-messages`,
            {
              withCredentials: true,
            }
          );
          if (response.data) {
            setLastMessage(response.data.lastMessages);
          }
          // console.log(response.data.lastMessages)
          setContacts(res.data.contactUsers);
          setFetchUserChats(false);
        }
      })();
    }
  }, [fetchUserChats, giveAccess]);

  useEffect(() => {
    console.log("last messages", lastMessage)
    if (lastMessage?.length > 0) {
      const sortedLastMessages = lastMessage.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const orderedContacts = sortedLastMessages.map((item) =>
        contacts.find((contact) => contact._id === item.contactId)
      );
      setContacts(orderedContacts);
    }
  }, [lastMessage]);
};

export default useFetchData;
