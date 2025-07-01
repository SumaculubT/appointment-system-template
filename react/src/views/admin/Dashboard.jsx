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

const Dashboard = () => {
  const { user, setUser } = useStateContext();
  const [initial, setInitial] = useState();
  const [sideNav, setSideNav] = useState(true);
  const [modalProfile, setModalProfile] = useState(false);
  const viewProfileBgRef = useRef(null);
  const viewProfileRef = useRef(null);
  const { setNotification } = useStateContext();
  const [editPersonalInfo, setEditPersonalInfo] = useState(true);
  const [editAccountDetails, setEditAccountDetails] = useState(true);

  const toggleSideNav = () => {
    setSideNav((prev) => !prev);
  };

  useEffect(() => {
    axiosClient.get(`/user`).then(({ data }) => {
      setUser(data);
      setInitial(user);
    });
  }, []);
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  const viewProfile = () => {
    setModalProfile(true);
    console.log("tanginamo");
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

  const UpdateAdminUser = (ev) => {
    ev.preventDefault();
    axiosClient
      .put(`/users/${user.id}`, initial)
      .then(() => {
        setNotification("User was successfully updated");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className=" flex font-raleway min-h-screen bg-gray-100">
      {modalProfile && (
        <>
          <div
            ref={viewProfileBgRef}
            className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-xs"
          ></div>
          <div
            ref={viewProfileRef}
            className="fixed scale-0 pb-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
          >
            <div className=" flex justify-between h-fit w-full p-2 ">
              <h1 className=" text-gray-900 text-xl font-bold">Edit Profile</h1>
              <LiaTimesSolid
                onClick={handleClose}
                className=" cursor-pointer text-gray-600 text-2xl"
              />
            </div>
            <div className=" w-11/12 m-auto">
              <div className=" flex flex-row gap-4 py-5 border-t border-gray-300">
                <div className=" bg-gray-900 h-16 w-16 rounded-full"></div>
                <div className=" flex flex-col my-auto gap-2">
                  <div className=" flex flex-row gap-2 text-sm">
                    <button className=" px-6 py-1 bg-blue-700 rounded-sm text-white ">
                      Upload Photo
                    </button>
                    <button className=" px-6 py-1 border border-gray-700 rounded-sm text-gray-900">
                      Remove Photo
                    </button>
                  </div>
                  <span className=" text-sm">
                    {new Date(user.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
              <form onSubmit={UpdateAdminUser}>
                <div className=" flex flex-col gap-4 pb-5 border-b border-gray-300">
                  <div className=" flex justify-between">
                    <h1 className=" text-gray-900 text-lg font-bold">
                      Personal Information
                    </h1>
                    {editPersonalInfo && (
                      <a
                        onClick={() => setEditPersonalInfo(false)}
                        className=" cursor-pointer text-sm font-bold text-blue-700 hover:scale-105 hover:text-blue-900 duration-300 my-auto"
                      >
                        Edit
                      </a>
                    )}
                    {!editPersonalInfo && (
                      <a
                        onClick={() => {
                          setEditPersonalInfo(true);
                          setInitial(user);
                        }}
                        className=" cursor-pointer text-sm font-bold text-red-700 hover:scale-105 hover:text-red-900 duration-300 my-auto"
                      >
                        Cancel
                      </a>
                    )}
                  </div>

                  <div className=" flex flex-col gap-1 w-full">
                    <h1 className=" text-xs font-semibold">Full Name</h1>
                    <input
                      className={` p-2 border ${
                        editPersonalInfo ? "border-gray-400" : "border-blue-600"
                      } rounded-sm shadow-sm`}
                      type="text"
                      name="name"
                      id="name"
                      disabled={editPersonalInfo}
                      value={initial.name}
                      onChange={(ev) =>
                        setInitial({ ...initial, name: ev.target.value })
                      }
                    />
                  </div>
                  <div className=" flex flex-row text-sm gap-4 w-full">
                    <div className=" flex flex-col gap-1 w-full">
                      <h1 className=" text-xs font-semibold">Contact Number</h1>
                      <input
                        className={` p-2 border ${
                          editPersonalInfo
                            ? "border-gray-400"
                            : "border-blue-600"
                        } rounded-sm shadow-sm`}
                        type="text"
                        name="name"
                        id="name"
                        value={initial.contact_number}
                        onChange={(ev) =>
                          setInitial({
                            ...initial,
                            contact_number: ev.target.value,
                          })
                        }
                      />
                    </div>
                    <div className=" flex flex-col gap-1 w-full">
                      <h1 className=" text-xs font-semibold">Position</h1>
                      <p className=" disabled p-2 border border-gray-300 rounded-sm shadow-sm">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className=" flex flex-col gap-4 border-b border-gray-300 pb-5 mb-5">
                  <div className=" flex justify-between pt-4">
                    <h1 className=" text-gray-900 text-lg font-bold">
                      Account Details
                    </h1>
                    {editAccountDetails && (
                      <a
                        onClick={() => setEditAccountDetails(false)}
                        className=" cursor-pointer text-sm font-bold text-blue-700 hover:scale-105 hover:text-blue-900 duration-300 my-auto"
                      >
                        Edit
                      </a>
                    )}
                    {!editAccountDetails && (
                      <a
                        onClick={() => {
                          setEditAccountDetails(true);
                          setInitial(user);
                        }}
                        className=" cursor-pointer text-sm font-bold text-red-700 hover:scale-105 hover:text-red-900 duration-300 my-auto"
                      >
                        Cancel
                      </a>
                    )}
                  </div>
                  <div className=" flex flex-col gap-1">
                    <h1 className=" text-xs font-semibold">Email</h1>
                    <input
                      className={` p-2 border ${
                        editAccountDetails
                          ? "border-gray-300"
                          : "border-blue-600"
                      } rounded-sm shadow-sm`}
                      type="text"
                      name="name"
                      id="name"
                      disabled={editAccountDetails}
                      value={initial.email}
                      onChange={(ev) =>
                        setInitial({ ...initial, email: ev.target.value })
                      }
                    />
                  </div>
                  <div className=" flex flex-row text-sm gap-4 w-full">
                    <div className=" flex flex-col gap-1 w-full">
                      <h1 className=" text-xs font-semibold">Password</h1>
                      <input
                        className={` p-2 border ${
                          editAccountDetails
                            ? "border-gray-300"
                            : "border-blue-600"
                        } rounded-sm shadow-sm`}
                        name="name"
                        id="name"
                        placeholder="Password"
                        disabled={editAccountDetails}
                        onChange={(ev) =>
                          setInitial({ ...initial, password: ev.target.value })
                        }
                      />
                    </div>
                    <div className=" flex flex-col gap-1 w-full">
                      <h1 className=" text-xs font-semibold">
                        Confirm Password
                      </h1>
                      <input
                        className={` p-2 border ${
                          editAccountDetails
                            ? "border-gray-300"
                            : "border-blue-600"
                        } rounded-sm shadow-sm`}
                        name="name"
                        id="name"
                        placeholder="Confirm password"
                        disabled={editAccountDetails}
                        onChange={(ev) =>
                          setInitial({
                            ...initial,
                            password_confirmation: ev.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className=" flex flex-row w-full gap-2">
                  <a
                    onClick={handleClose}
                    className=" cursor-pointer text-center py-2 text-sm w-full border border-gray-800 rounded-sm text-gray-900 shadow-sm font-semibold"
                  >
                    Close
                  </a>
                  <button className=" cursor-pointer py-2 text-sm w-full bg-blue-700  rounded-sm text-gray-100 shadow-sm font-semibold">
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <nav
        className={`fixed left-0 top-0 h-screen pt-24 px-4 ${
          sideNav ? "w-20" : "w-56"
        } text-gray-900 flex flex-col transition-[width] duration-300 ease-in-out overflow-y-hidden`}
      >
        <button
          onClick={viewProfile}
          className=" cursor-pointer flex justify-between w-full mb-8 gap-4  hover:bg-gray-300 p-1 duration-200 rounded-sm  "
        >
          <div className=" flex flex-row items-center gap-4">
            <div className=" bg-gray-900 rounded-full w-10 h-10 flex"></div>
            <div className={` flex flex-col ${sideNav ? "hidden" : "visible"}`}>
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
