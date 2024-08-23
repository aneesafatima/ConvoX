import React, { createContext, useState } from "react";

export const GlobalState = createContext();

export function GlobalProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  const [authStatus, setAuthStatus] = useState("signup");
  const [errMessage, setErrMessage] = useState("");
  const [giveAccess, seTGiveAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [refetch, setRefetch] = useState(true);
  const [passwordDetails, setPasswordDetails] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [selectUser, setSelectUser] = useState(false);
  const [allUsers, setAllUsers] = useState();
  const [userContacts, setUserContacts] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [socket, setSocket] = useState(undefined);
  const [fetchMessages, setFetchMessages] = useState(false);
  const [isGroup, setIsGroup] = useState(false);

  return (
    <GlobalState.Provider
      value={{
        giveAccess,
        seTGiveAccess,
        errMessage,
        setErrMessage,
        currentUser,
        setCurrentUser,
        refetch,
        setRefetch,
        authStatus,
        setAuthStatus,
        userDetails,
        setUserDetails,
        passwordDetails,
        setPasswordDetails,
        showLoader,
        setShowLoader,
        showErr,
        setShowErr,
        selectUser,
        setSelectUser,
        allUsers,
        setAllUsers,
        userContacts,
        setUserContacts,
        selectedChat, setSelectedChat,
        socket,
        setSocket,
        messages,
        setMessages,
        fetchMessages,
        setFetchMessages,
        isGroup,
        setIsGroup,
      }}
    >
      {children}
    </GlobalState.Provider>
  );
}
