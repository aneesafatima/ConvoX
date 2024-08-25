import { Routes, Route, useLocation } from "react-router-dom";
import { Auth, Home } from "./components";
import { useContext, useEffect, useState } from "react";
import { NotFound } from "./components";
import { GlobalState } from "./context/GlobalState";
// import 'react-tooltip/dist/react-tooltip.css'

function App() {
  const location = useLocation();
  const { giveAccess, refetch } = useContext(GlobalState);

  if (!giveAccess && location.pathname === "/home" && !refetch)
    return (
      <NotFound
        code="400 - Bad Request"
        link="/"
        location="SignUp/LogIn"
        message="You are not logged in. Please log in to access the dashboard."
      />
    );

  return (
    <div
      className={`flex  h-svh `}
    >
      <Routes>
        <Route path="/" element={<Auth />} />

        <Route path="/home" element={<Home />} />
        <Route
          path="*"
          element={
            <NotFound
              code="404 - Page not found"
              link="/"
              location="home"
              message="Sorry, the page you are looking for does not exist."
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
