import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../../axios-client";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { ClipLoader, PulseLoader } from "react-spinners";
import { useStateContext } from "../../../contexts/ContextProvider";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUserloading, setNewUserLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const addNewRef = useRef(null);
  const addNewBgRef = useRef(null);

  const [errors, setErrors] = useState(null);
  const { notification, setNotification } = useStateContext();
  const [visible, setVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("fade-in");

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

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/users")
      .then(({ data }) => {
        setLoading(false);
        const filteredUsers = data.data.filter((u) => u.role !== "admin");
        setUsers(filteredUsers);
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
      }, 3000);

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

    axiosClient.delete(`/users/${u.id}`).then(() => {
      setNotification("User was successfully deleted");
      getUsers();
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
  return (
    <>
      {loading && (
        <div className="h-[78vh] w-full flex items-center justify-center">
          <PulseLoader color="#9F0712" size={10} />
        </div>
      )}
      {notification && (
        <div
          className={`fixed bottom-15 right-10 z-50 bg-green-600 text-white px-10 py-6 shadow-lg ${animationClass}`}
        >
          {notification}
        </div>
      )}
      {!loading && (
        <section className="h-full w-11/12 m-auto">
          <div className=" flex flex-row mb-5 justify-between items-center">
            <h1 className=" text-3xl font-semibold ">Accounts</h1>
            <a
              className=" cursor-pointer py-3 px-6 bg-green-600 text-white -skew-x-12 hover:px-8 mr-4 hover:mr-2 duration-300"
              onClick={addNew}
            >
              Add new
            </a>
          </div>
          <div className="h-full w-full">
            <table className="min-w-full text-gray-900 text-center divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Created
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-gray-200 ">
                {users
                  .filter((u) => u.role !== "admin")
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.id}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {u.name}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {u.contact_number}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {u.email}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm text-gray-900">
                        {u.created_at}
                      </td>
                      <td className="py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex justify-center items-center space-x-1">
                          <Link
                            to={"/dashboard/accounts/" + u.id}
                            className="flex text-white px-4 py-2 -skew-x-12 bg-yellow-500 hover:-ml-4 hover:px-6 duration-300"
                          >
                            Edit
                          </Link>
                          <a
                            onClick={(ev) => onDelete(u)}
                            className="flex cursor-pointer text-white px-4 py-2 -skew-x-12 bg-red-700  hover:-mr-4 hover:px-6 duration-300"
                          >
                            Delete
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
            className="absolute scale-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
          >
            <div className=" flex justify-end h-fit w-full">
              <FaTimes
                onClick={handleClose}
                className=" cursor-pointer text-xl m-2"
              />
            </div>
            <form
              onSubmit={onSubmit}
              className=" h-full flex flex-col gap-3 p-10 text-gray-900"
            >
              <h1 className=" text-center font-bold text-4xl mb-10">
                ADD ACCOUNT
              </h1>
              {errors && (
                <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                  {Object.keys(errors).map((key) => (
                    <p key={key}>{errors[key][0]}</p>
                  ))}
                </div>
              )}
              <div className=" flex flex-row w-full gap-4">
                <div className=" flex flex-col w-2/3">
                  <label className=" font-semibold" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    value={user.name}
                    onChange={(ev) =>
                      setUser({ ...user, name: ev.target.value })
                    }
                    className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                    placeholder="Full Name"
                  />
                </div>
                <div className=" flex flex-col w-1/3">
                  <label className=" font-semibold" htmlFor="role">
                    Role
                  </label>
                  <select
                    id="role"
                    className="p-2 rounded border border-gray-300 shadow-sm text-md"
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
              <div className=" flex flex-col">
                <label className=" font-semibold" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  value={user.email}
                  onChange={(ev) =>
                    setUser({ ...user, email: ev.target.value })
                  }
                  className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                  type="email"
                  placeholder="Email Address"
                />
              </div>
              <div className=" flex flex-col">
                <label className=" font-semibold" htmlFor="contact_number">
                  Contact Number
                </label>
                <input
                  id="contact_number"
                  value={user.contact_number}
                  onChange={(ev) =>
                    setUser({ ...user, contact_number: ev.target.value })
                  }
                  className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                  placeholder="Contact Number"
                />
              </div>
              <div className=" flex flex-col">
                <label className=" font-semibold" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  onChange={(ev) =>
                    setUser({ ...user, password: ev.target.value })
                  }
                  className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                  type="password"
                  placeholder="Password"
                />
              </div>
              <div className=" flex flex-col">
                <label
                  className=" font-semibold"
                  htmlFor="password_confirmation"
                >
                  Confim Password
                </label>
                <input
                  id="password_confirmation"
                  onChange={(ev) =>
                    setUser({ ...user, password_confirmation: ev.target.value })
                  }
                  className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
              <div className="w-full flex flex-col gap-4">
                <button
                  className="bg-green-600 text-white py-3 rounded-md shadow-md hover:bg-green-700 duration-300"
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
    </>
  );
};

export default Accounts;
