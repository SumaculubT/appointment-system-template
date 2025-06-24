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
      <div className=" h-fit min-h-screen bg-gray-200">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersLayout;
