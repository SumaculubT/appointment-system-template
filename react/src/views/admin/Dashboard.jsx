import React, { useEffect } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaChartBar } from "react-icons/fa";
import { MdOutlineMessage, MdOutlinePeopleAlt } from "react-icons/md";
import { LuBookUser } from "react-icons/lu";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { GoSidebarExpand } from "react-icons/go";

const Dashboard = () => {
  const { user, setUser } = useStateContext();
  const [sideNav, setSideNav] = useState(true);

  const toggleSideNav = () => {
    setSideNav((prev) => !prev);
  };

  useEffect(() => {
    axiosClient.get(`/user`).then(({ data }) => {
      setUser(data);
    });
  }, []);
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return (
    <div className=" flex font-raleway min-h-screen bg-gray-100">
      <nav
        className={`fixed left-0 top-0 h-screen pt-24 px-4 ${
          sideNav ? "w-20" : "w-56"
        } text-gray-900 flex flex-col transition-[width] duration-300 ease-in-out overflow-y-hidden`}
      >
        <div className=" flex justify-between w-full mb-8 gap-4">
          <div className=" flex flex-row items-center gap-4">
            <div className=" bg-gray-900 w-12 h-12 flex"></div>
            <div className={` flex flex-col ${sideNav ? "hidden" : "visible"}`}>
              <h1 className=" font-semibold text-md">{user.name}</h1>
              <p className=" text-sm">{user.role}</p>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          <li>
            <Link
              to="/dashboard/statistics"
              className="flex items-center p-3 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <FaChartBar className="text-xl" />

              <span
                className={`ml-4 text-sm ${
                  sideNav ? "hidden" : "visible"
                } whitespace-nowrap`}
              >
                Statistics
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/books"
              className="flex items-center p-3 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <LuBookUser className="text-xl" />

              <span
                className={`ml-4 text-sm ${
                  sideNav ? "hidden" : "visible"
                } whitespace-nowrap`}
              >
                Books
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/inquiries"
              className="flex items-center p-3 rounded-md w-full hover:bg-gray-300 duration-200"
            >
              <MdOutlineMessage className="text-xl" />

              <span
                className={`ml-4 text-sm ${
                  sideNav ? "hidden" : "visible"
                } whitespace-nowrap`}
              >
                Inquiries
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/accounts"
              className="flex items-center p-3 rounded-md w-full hover:bg-gray-300 duration-200 "
            >
              <MdOutlinePeopleAlt className="text-xl" />

              <span
                className={`ml-4 text-sm ${
                  sideNav ? "hidden" : "visible"
                } whitespace-nowrap`}
              >
                Accounts
              </span>
            </Link>
          </li>
        </ul>
      </nav>

      <div
        className={`flex-1 mt-24 min-h-[87vh] mr-4 mb-4 pb-10 bg-gray-300 h-fit rounded-xl
    transition-all duration-300 ease-in-out
    ${sideNav ? "ml-20" : "ml-56"}`}
      >
        <div className=" flex flex-row items-center gap-4 mx-2 mt-6 h-full text-xl text-gray-700">
          <GoSidebarExpand
            onClick={toggleSideNav}
            className=" cursor-pointer hover:text-gray-900 duration-200 z-10"
          />
          <span className=" text-base font-semibold text-gray-800">
            | Dashboard
          </span>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
