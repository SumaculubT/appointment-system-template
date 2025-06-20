import React, { useEffect } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaChartBar } from "react-icons/fa";
import { MdOutlineMessage, MdOutlinePeopleAlt } from "react-icons/md";
import { LuBookUser } from "react-icons/lu";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

const Dashboard = () => {
  const { user, setUser } = useStateContext();

  useEffect(() => {
    axiosClient.get(`/user`).then(({ data }) => {
      setUser(data);
    });
  }, []);
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <div className=" flex font-raleway min-h-screen bg-gray-200">
      <nav className="fixed left-0 top-0 h-screen pt-24 px-4 w-1/5 text-gray-900 flex flex-col transition-all duration-300 overflow-y-hidden">
        <div className=" flex flex-row w-full items-center gap-4 mb-8">
          <div className=" bg-gray-900 w-14 h-14 flex"></div>
          <div className=" flex flex-col">
            <h1 className=" font-semibold text-md">{user.name}</h1>
            <p className=" text-sm">{user.role}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              to="/dashboard/statistics"
              className="flex items-center p-2 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <FaChartBar className="text-xl" />

              <span className="ml-4 text-md whitespace-nowrap">Statistics</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/books"
              className="flex items-center p-2 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <LuBookUser className="text-xl" />

              <span className="ml-4 text-md whitespace-nowrap">Books</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/inquiries"
              className="flex items-center p-2 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <MdOutlineMessage className="text-xl" />

              <span className="ml-4 text-md whitespace-nowrap">Inquiries</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/accounts"
              className="flex items-center p-2 rounded-md w-full hover:bg-gray-300 duration-200 "
            >
              <MdOutlinePeopleAlt className="text-xl" />

              <span className="ml-4 text-md whitespace-nowrap">Accounts</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 mt-24 min-h-[87vh] mr-4 mb-4 py-10 bg-gray-300 h-fit rounded-xl ml-[20%]">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
