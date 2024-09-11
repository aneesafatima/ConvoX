import { useEffect, useContext } from "react";
import axios from "axios";
import { GlobalState } from "../context/GlobalState";

const useFetchData = (setContacts, setGroups) => {
  const {
   seTGiveAccess,
    setCurrentUser,
    setFetch,
    setUnreadMessages,
    setShowErr,
    fetchUserChats,
    setFetchUserChats,
    fetchUsers,
    setFetchUsers,
    setAllUsers,
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
        setShowErr({ status: true, message: err.message });
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (fetchUserChats) {
      (async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_URL}/api/users/userContacts`,
          {
            withCredentials: true,
          }
        );
        if (res.data?.status === "success") {
          setContacts(res.data.contactUsers);
          setGroups(res.data.groups);
          setFetchUserChats(false);
        }
      })();
    }
  }, [fetchUserChats]);

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
};

export default useFetchData;
