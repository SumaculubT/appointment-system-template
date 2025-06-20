import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import Navbar from "../nav/Navbar";

const UsersLayout = () => {
  const { user, token } = useStateContext();

  if (!token) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default UsersLayout;
