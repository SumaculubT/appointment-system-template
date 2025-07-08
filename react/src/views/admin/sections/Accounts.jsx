import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios-client";
import { Link, useNavigate } from "react-router-dom";
import {
  FaDotCircle,
  FaRegTrashAlt,
  FaTimes,
  FaUserLock,
} from "react-icons/fa";
import { ClipLoader, PulseLoader } from "react-spinners";
import { useStateContext } from "../../../contexts/ContextProvider";
import { PiPlus } from "react-icons/pi";
import { LiaTimesSolid } from "react-icons/lia";
import { BiCalendar } from "react-icons/bi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { GoTrash } from "react-icons/go";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUserloading, setNewUserLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const viewProfileRef = useRef(null);
  const viewProfileBgRef = useRef(null);
  const addNewRef = useRef(null);
  const addNewBgRef = useRef(null);

  const [errors, setErrors] = useState(null);
  const { notification, setNotification } = useStateContext();
  const [visible, setVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [selectedUserNav, setSelectedUserNav] = useState("user");
  const [today, setToday] = useState(getFormattedDate());

  const defaultUser = {
    id: null,
    name: "",
    email: "",
    contact_number: "",
    role: "",
    password: "",
    password_confirmation: "",
  };
  const [user, setUser] = useState({ defaultUser });

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = (page = 1, role = selectedUserNav) => {
    setLoading(true);

    axiosClient
      .get(`/users?page=${page}&role=${role}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);

        setPagination({
          links: data.links || [],
          meta: data.meta || {},
        });

        setCurrentPage(data.meta?.current_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (notification) {
      setVisible(true);
      setAnimationClass("fade-in");

      const fadeOutTimer = setTimeout(() => {
        setAnimationClass("fade-out");
      }, 3700);

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 4000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [notification]);

  const onDelete = (u) => {
    if (
      !window.confirm("Are you sure you want to delete this user: " + u.name)
    ) {
      return;
    }
    setNotification(null);

    axiosClient.delete(`/users/${u.id}`).then(() => {
      setNotification("User was successfully deleted");
      getUsers();
    });
  };

  const viewUserProfile = (u) => {
    setUser(u);
    setViewProfile(true);
    setTimeout(() => {
      viewProfileRef.current.classList.remove("scale-0");
      viewProfileRef.current.classList.add("scale-100");
      viewProfileBgRef.current.classList.remove("scale-0");
      viewProfileBgRef.current.classList.add("scale-100");
    }, 100);
  };

  const closeUserProfile = () => {
    viewProfileRef.current.classList.add("scale-0");
    viewProfileRef.current.classList.remove("scale-100");
    viewProfileBgRef.current.classList.add("scale-0");
    viewProfileBgRef.current.classList.remove("scale-100");
    setUser(defaultUser);
    setTimeout(() => {
      setViewProfile(false);
      document.body.classList.remove("overflow-hidden");
    }, 200);
  };

  const onEditUser = (ev) => {
    ev.preventDefault();
    setSaveLoading(true);
    setNotification(null);
    axiosClient
      .put(`/users/${user.id}`, user)
      .then(() => {
        closeUserProfile();
        setSaveLoading(false);
        getUsers();
        setNotification("User was successfully updated");
      })
      .catch((err) => {
        setSaveLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setNewUserLoading(true);

    axiosClient
      .post(`/users`, user)
      .then(() => {
        setNewUserLoading(false);
        setNotification("New user was added");
        getUsers();
        setUser(defaultUser);
        handleClose();
        navigate("/dashboard/accounts");
      })
      .catch((err) => {
        setNewUserLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };
  const addNew = () => {
    setIsVisible(true);
    setTimeout(() => {
      addNewRef.current.classList.remove("scale-0");
      addNewRef.current.classList.add("scale-100");
      addNewBgRef.current.classList.remove("scale-0");
      addNewBgRef.current.classList.remove("scale-100");
    }, 100);
  };

  const handleClose = () => {
    addNewRef.current.classList.add("scale-0");
    addNewRef.current.classList.remove("scale-100");
    addNewBgRef.current.classList.add("scale-0");
    addNewBgRef.current.classList.remove("scale-100");
    setErrors(null);
    setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("overflow-hidden");
    }, 200);
  };

  const infoGraph = [
    {
      name: "All Inquiries",
      num: `200 Inquiries`,
      info: `12 In this month`,
    },
    {
      name: "Pending Inquiries",
      num: `17 Inquiries`,
      info: "Current",
    },
    {
      name: "Approved Inquiries",
      num: `74 Inquiries`,
      info: `45 In this day`,
    },
    {
      name: "Rejected Inquiries",
      num: `42 Inquiries`,
      info: `18 In this day`,
    },
  ];

  const userNav = ["admin", "employees", "user"];

  const filteredUsers =
    selectedUserNav !== "all"
      ? users.filter((u) => u.role === selectedUserNav.toLowerCase())
      : users;

  function getFormattedDate() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getFormattedDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    "bg-red-500 ",
    "bg-green-500 ",
    "bg-blue-500  ",
    "bg-yellow-500  ",
    "bg-purple-500  ",
    "bg-pink-500  ",
    "bg-indigo-500  ",
    "bg-teal-500  ",
    "bg-orange-500  ",
  ];

  function getRandomColorClass(name) {
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  return (
    <>
      {notification && (
        <div
          className={`fixed bottom-15 -right-4 z-50 bg-green-500 font-semibold text-xl -skew-x-12 text-white px-20 py-8 shadow-lg ${animationClass}`}
        >
          {notification}
        </div>
      )}
      <div className=" flex flex-row gap-4 justify-end mb-4 mr-10">
        <span className="flex flex-row text-gray-800 py-2 px-8 border border-gray-800 shadow-sm rounded-sm font-semibold">
          <BiCalendar className="h-full items-center mr-2" />
          {today}
        </span>
        <button
          className=" cursor-pointer flex flex-row py-2 px-8 bg-blue-600 text-white shadow-sm rounded-sm font-semibold hover:bg-blue-800 duration-200"
          onClick={addNew}
        >
          <PiPlus className=" text-xl h-full items-center mr-2" />
          Add new
        </button>
      </div>
      <div className=" flex flex-row w-11/12 m-auto mb-10 gap-10">
        {infoGraph.map((i) => (
          <div
            key={i.name}
            className=" cursor-pointer pr-6 py-4 shadow-sm bg-gray-100 w-full rounded-sm flex flex-col hover:scale-101 duration-300"
          >
            <h3 className=" text-gray-500 text-sm pl-6 font-semibold">
              {i.name}
            </h3>
            <h1 className=" text-gray-800 border-l-3 pl-6 py-2 border-blue-600 text-2xl font-semibold">
              {i.num}
            </h1>
            <h2 className=" text-green-600 pl-6 text-sm font-semibold">
              {i.info}
            </h2>
          </div>
        ))}
      </div>
      <div className=" flex flex-row border-b gap-6 text-sm font-semibold border-gray-400 w-11/12 m-auto mb-4">
        {userNav.map((role) => (
          <button
            key={role}
            onClick={() => {
              setSelectedUserNav(role);
            }}
            className={`px-2 py-1 hover:text-blue-500 ${
              selectedUserNav === role
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
      {loading && (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <PulseLoader color="#9F0712" size={6} />
        </div>
      )}
      {!loading && (
        <section className="h-full">
          <div className="h-full w-11/12 m-auto">
            <table className=" text-gray-900 text-left w-11/12 m-auto">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className=" px-6 py-3 text-sm font-semibold tracking-wider"
                  >
                    Account
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-sm font-semibold tracking-wider"
                  >
                    Contact Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-sm font-semibold tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-sm font-semibold tracking-wider"
                  >
                    Date Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-sm font-semibold tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className=" cursor-pointer text-left hover:bg-gray-200"
                  >
                    <td className="pl-2 py-2 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-row gap-4">
                        <div
                          className={`h-10 w-10 text-gray-100 rounded-full flex items-center justify-center ${getRandomColorClass(
                            u.name
                          )}`}
                        >
                          <h1 className="text-4xl">
                            {u.name.charAt(0).toUpperCase()}
                          </h1>
                        </div>
                        <div className="flex flex-col h-full my-auto">
                          <div className="flex flex-row gap-2">
                            {u.name
                              .split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                            <FaDotCircle
                              className={` my-auto text-xs ${
                                u.role === "user"
                                  ? "text-green-500"
                                  : u.role === "employee"
                                  ? "text-blue-600"
                                  : u.role === "admin"
                                  ? "bg-indigo-700"
                                  : "bg-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex flex-row">
                            <FaUserLock className=" my-auto mr-2 text-sm" />{" "}
                            {u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                      {u.contact_number === null
                        ? "No Contact Number"
                        : u.contact_number}
                    </td>
                    <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                      {u.email}
                    </td>
                    <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                      {u.created_at}
                    </td>
                    <td className="py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex text-lg gap-1 ml-5 items-center ">
                        <button onClick={() => viewUserProfile(u)}>
                          <div className="hover:bg-gray-300 text-yellow-600  rounded-full duration-100 p-1">
                            <HiOutlinePencilSquare />
                          </div>
                        </button>
                        <a onClick={(ev) => onDelete(u)} className="">
                          <div className="hover:bg-gray-300 text-red-600 rounded-full duration-100 p-1">
                            <GoTrash />
                          </div>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section>
        {pagination.meta && pagination.meta.last_page > 1 && (
          <nav>
            <ul className=" flex flex-row gap-2 w-11/12 m-auto h-full justify-center mt-10">
              {pagination?.meta?.current_page !== 1 && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold text-sm py-2 hover:scale-105 duration-300"
                    onClick={() => getInquiries(1, selectedInqNav)}
                  >
                    {"<< First"}
                  </button>
                </li>
              )}

              {pagination?.meta?.current_page > 1 && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(currentPage - 1, selectedInqNav)
                    }
                  >
                    Previous
                  </button>
                </li>
              )}

              {pagination.meta &&
                (() => {
                  const totalPages = pagination.meta.last_page;
                  const currentPage = pagination.meta.current_page;
                  const pageButtons = [];

                  const createPageButton = (page) => (
                    <li key={page}>
                      <button
                        onClick={() => getInquiries(page)}
                        className={`cursor-pointer px-3 py-1 rounded-sm border border-gray-900 shadow-sm hover:text-white hover:bg-gray-900 duration-300 ${
                          currentPage === page
                            ? "text-white bg-gray-900"
                            : "text-gray-900"
                        }`}
                        disabled={currentPage === page}
                      >
                        {page}
                      </button>
                    </li>
                  );

                  // Always show first page
                  pageButtons.push(createPageButton(1));

                  // Show "..." if current page > 3
                  if (currentPage > 4) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Show pages around the current page
                  for (
                    let i = Math.max(2, currentPage - 2);
                    i <= Math.min(totalPages - 1, currentPage + 2);
                    i++
                  ) {
                    pageButtons.push(createPageButton(i));
                  }

                  // Show "..." before last page
                  if (currentPage < totalPages - 3) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Always show last page if more than one page
                  if (totalPages > 1) {
                    pageButtons.push(createPageButton(totalPages));
                  }

                  return pageButtons;
                })()}

              {pagination?.meta?.current_page < pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(currentPage + 1, selectedInqNav)
                    }
                  >
                    Next
                  </button>
                </li>
              )}
              {pagination?.meta?.current_page !==
                pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-sm text-gray-800 font-semibold py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(pagination.meta.last_page, selectedInqNav)
                    }
                  >
                    {"Last >>"}
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </section>

      <section>
        {isVisible && (
          <div
            ref={addNewBgRef}
            className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-sm"
          ></div>
        )}
        {isVisible && (
          <div
            ref={addNewRef}
            key="userCreate"
            className="fixed scale-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
          >
            <form onSubmit={onSubmit} className="text-gray-900">
              <div className=" flex justify-between p-2 h-fit w-full ">
                <h1 className=" text-gray-900 text-xl font-bold">
                  Add New Account
                </h1>
                <LiaTimesSolid
                  onClick={handleClose}
                  className=" cursor-pointer text-gray-600 text-2xl"
                />
              </div>
              {errors && (
                <>
                  <div className=" w-11/12 m-auto p-2 rounded-md shadow-md bg-red-500 text-white text-sm">
                    <div className=" w-full flex justify-end">
                      <LiaTimesSolid
                        color="#fff"
                        onClick={() => {
                          setErrors(null);
                        }}
                        className=" cursor-pointer text-gray-600 text-xl"
                      />
                    </div>

                    {Object.keys(errors).map((key) => (
                      <p key={key}>{errors[key][0]}</p>
                    ))}
                  </div>
                </>
              )}
              <div className="flex flex-row w-11/12 m-auto border-t border-gray-300 py-2 gap-4 ">
                <div className=" flex flex-col w-2/3">
                  <label className=" text-xs font-semibold" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={user.name}
                    onChange={(ev) =>
                      setUser({ ...user, name: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div className=" flex flex-col w-1/3">
                  <label className=" text-xs font-semibold" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    value={user.role}
                    onChange={(ev) =>
                      setUser({ ...user, role: ev.target.value })
                    }
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col w-11/12 m-auto py-2 gap-4 mb-6">
                <div className=" flex flex-col w-full">
                  <label className=" text-xs font-semibold" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    value={user.email}
                    onChange={(ev) =>
                      setUser({ ...user, email: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="email"
                    placeholder="Email Address"
                  />
                </div>
                <div className=" flex flex-col">
                  <label
                    className=" text-xs font-semibold"
                    htmlFor="contact_number"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contact_number"
                    value={user.contact_number}
                    onChange={(ev) =>
                      setUser({ ...user, contact_number: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    placeholder="Contact Number"
                  />
                </div>
                <div className=" flex flex-col">
                  <label className=" text-xs font-semibold" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    onChange={(ev) =>
                      setUser({ ...user, password: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className=" flex flex-col">
                  <label
                    className=" text-xs font-semibold"
                    htmlFor="password_confirmation"
                  >
                    Confim Password
                  </label>
                  <input
                    id="password_confirmation"
                    onChange={(ev) =>
                      setUser({
                        ...user,
                        password_confirmation: ev.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="password"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div className=" flex justify-between w-11/12 gap-2 m-auto mb-6">
                <a
                  onClick={handleClose}
                  className=" cursor-pointer py-2 w-full text-center text-gray-900 border border-gray-900 rounded-sm font-semibold shadow-sm hover:bg-gray-900 hover:text-white duration-100"
                >
                  Close
                </a>
                <button
                  className=" cursor-pointer py-2 w-full rounded-sm bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700 duration-100"
                  disabled={newUserloading}
                >
                  {newUserloading ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section>
        {viewProfile && (
          <div
            ref={viewProfileBgRef}
            className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-sm"
          ></div>
        )}
        {viewProfile && (
          <div
            ref={viewProfileRef}
            key="userCreate"
            className="fixed scale-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
          >
            <form onSubmit={onEditUser} className="text-gray-900">
              <div className=" flex justify-between p-2 h-fit w-full ">
                <h1 className=" text-gray-900 text-xl font-bold">
                  Edit User's Information
                </h1>
                <LiaTimesSolid
                  onClick={closeUserProfile}
                  className=" cursor-pointer text-gray-600 text-2xl"
                />
              </div>
              {errors && (
                <>
                  <div className=" w-11/12 m-auto p-2 rounded-md shadow-md bg-red-500 text-white text-sm">
                    <div className=" w-full flex justify-end">
                      <LiaTimesSolid
                        color="#fff"
                        onClick={() => {
                          setErrors(null);
                        }}
                        className=" cursor-pointer text-gray-600 text-xl"
                      />
                    </div>

                    {Object.keys(errors).map((key) => (
                      <p key={key}>{errors[key][0]}</p>
                    ))}
                  </div>
                </>
              )}
              <div className="flex flex-row w-11/12 m-auto border-t border-gray-300 py-2 gap-4 ">
                <div className=" flex flex-col w-2/3">
                  <label className=" text-xs font-semibold" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={user.name}
                    onChange={(ev) =>
                      setUser({ ...user, name: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div className=" flex flex-col w-1/3">
                  <label className=" text-xs font-semibold" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    value={user.role}
                    onChange={(ev) =>
                      setUser({ ...user, role: ev.target.value })
                    }
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col w-11/12 m-auto py-2 gap-4 mb-6">
                <div className=" flex flex-col w-full">
                  <label className=" text-xs font-semibold" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    value={user.email}
                    onChange={(ev) =>
                      setUser({ ...user, email: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="email"
                    placeholder="Email Address"
                  />
                </div>
                <div className=" flex flex-col">
                  <label
                    className=" text-xs font-semibold"
                    htmlFor="contact_number"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contact_number"
                    value={user.contact_number}
                    onChange={(ev) =>
                      setUser({ ...user, contact_number: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    placeholder="Contact Number"
                  />
                </div>
                <div className=" flex flex-col">
                  <label className=" text-xs font-semibold" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    onChange={(ev) =>
                      setUser({ ...user, password: ev.target.value })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                <div className=" flex flex-col">
                  <label
                    className=" text-xs font-semibold"
                    htmlFor="password_confirmation"
                  >
                    Confim Password
                  </label>
                  <input
                    id="password_confirmation"
                    onChange={(ev) =>
                      setUser({
                        ...user,
                        password_confirmation: ev.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 shadow-sm rounded-sm"
                    type="password"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div className=" flex justify-between w-11/12 gap-2 m-auto mb-6">
                <a
                  onClick={closeUserProfile}
                  className=" cursor-pointer py-2 w-full text-center text-gray-900 border border-gray-900 rounded-sm font-semibold shadow-sm hover:bg-gray-900 hover:text-white duration-100"
                >
                  Close
                </a>
                <button
                  className=" cursor-pointer py-2 w-full rounded-sm bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700 duration-100"
                  disabled={saveloading}
                >
                  {saveloading ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
};

export default Accounts;
