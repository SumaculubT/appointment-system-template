import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import Navbar from "../nav/Navbar";

const GuestsLayout = () => {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/home" />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default GuestsLayout;
