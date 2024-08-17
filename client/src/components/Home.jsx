import React, {useEffect, useContext} from 'react'

import axios from "axios";
import { ErrComponent } from ".";
import { GlobalState } from "../context/GlobalState";

function Home() {
  const {
    giveAccess,
    seTGiveAccess,
    setUser,
    refetch,
    setRefetch,
    setShowErr,
    showErr,
  } = useContext(GlobalState);

  useEffect(() => {
    if (refetch) {
      async function fetchData() {
        try {
          const res = await axios.get(`${import.meta.env.VITE_URL}/api/home`, {
            withCredentials: true,
          });

          if (res.data?.status === "success") {
            seTGiveAccess(true);
            setUser(res.data.user);
            setShowErr(false);
          }
        } catch (err) {
          setShowErr({ status: true, message: err.message });
        }
        setRefetch(false);
      }
      fetchData();
    }
  },[refetch] );

  if (showErr.status) return <ErrComponent message={showErr.message} />;

  if (refetch) {
    return (
      <p> Loading... </p>
    );
  }

  return (
    giveAccess &&
    !refetch && (
      <div className="text-3xl text-blue-500">
    Hello from home
      </div>
    )
  );
}

export default Home
