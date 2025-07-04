import React, { useEffect, useRef } from "react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { MdOutlineMessage, MdOutlinePeopleAlt } from "react-icons/md";
import { LuBookUser } from "react-icons/lu";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { GoSidebarExpand } from "react-icons/go";
import { LiaTimesSolid } from "react-icons/lia";
import { ClipLoader } from "react-spinners";
import ViewProfile from "./sections/Operation/ViewProfile";

const Dashboard = () => {
  const { user, setUser } = useStateContext();
  const [initial, setInitial] = useState();
  const [sideNav, setSideNav] = useState(true);
  const [modalProfile, setModalProfile] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const viewProfileBgRef = useRef(null);
  const viewProfileRef = useRef(null);

  const toggleSideNav = () => {
    setSideNav((prev) => !prev);
  };

  useEffect(() => {
    setUserLoading(true);
    axiosClient.get(`/user`).then(({ data }) => {
      setUser(data);
      setInitial(user);
      setUserLoading(false);
    });
  }, []);
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const viewProfile = () => {
    setModalProfile(true);
    setTimeout(() => {
      viewProfileRef.current.classList.remove("scale-0");
      viewProfileRef.current.classList.add("scale-100");
      viewProfileBgRef.current.classList.remove("scale-0");
      viewProfileBgRef.current.classList.add("scale-100");
    }, 100);
  };

  const handleClose = () => {
    viewProfileRef.current.classList.add("scale-0");
    viewProfileRef.current.classList.remove("scale-100");
    viewProfileBgRef.current.classList.add("scale-0");
    viewProfileBgRef.current.classList.remove("scale-100");
    setTimeout(() => {
      setModalProfile(false);
    }, 200);
  };

  return (
    <div className=" flex font-raleway min-h-screen bg-gray-100">
      {modalProfile && (
        <ViewProfile
          user={user}
          setUser={setUser}
          viewProfileRef={viewProfileRef}
          viewProfileBgRef={viewProfileBgRef}
          userLoading={userLoading}
          initial={initial}
          setInitial={setInitial}
          handleClose={handleClose}
          setModalProfile={setModalProfile}
        />
      )}
      <nav
        className={`fixed left-0 top-0 h-screen pt-24 px-4 ${
          sideNav ? "w-20" : "w-56"
        } text-gray-900 flex flex-col transition-[width] duration-300 ease-in-out overflow-y-hidden`}
      >
        <button
          onClick={viewProfile}
          className=" cursor-pointer flex justify-between w-full mb-8 gap-4  overflow-x-hidden hover:bg-gray-300 p-1 duration-200 rounded-sm  "
        >
          <div className=" flex flex-row items-center gap-4">
            <div className=" bg-gray-900 rounded-full w-10 h-10"></div>
            <div
              className={` text-left flex flex-col  ${
                sideNav ? "hidden" : "visible"
              }`}
            >
              <h1 className=" font-semibold text-md">{user.name}</h1>
              <p className=" text-sm">{user.role}</p>
            </div>
          </div>
        </button>

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
