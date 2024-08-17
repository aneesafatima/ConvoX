import React, { createContext, useState } from "react";

export const GlobalState = createContext();

export function GlobalProvider({ children }) {
  const [userDetails, setUserDetails] = useState({});
  const [authStatus, setAuthStatus] = useState("signup");
  const [errMessage, setErrMessage] = useState("");
  const [giveAccess, seTGiveAccess] = useState(false);
  const [user, setUser] = useState("");
  const [refetch, setRefetch] = useState(true);
  const [passwordDetails, setPasswordDetails] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [showErr, setShowErr] = useState(false);

  return (
    <GlobalState.Provider
      value={{
        giveAccess,
        seTGiveAccess,
        errMessage,
        setErrMessage,
        user,
        setUser,
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
        setShowErr
      }}
    >
      {children}
    </GlobalState.Provider>
  );
}