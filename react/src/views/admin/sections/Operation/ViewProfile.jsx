import React, { useRef, useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { ClipLoader } from "react-spinners";
import { useStateContext } from "../../../../contexts/ContextProvider";
import axiosClient from "../../../../axios-client";

const ViewProfile = ({
  user,
  setUser,
  viewProfileRef,
  viewProfileBgRef,
  userLoading,
  initial,
  setInitial,
  handleClose,
  setModalProfile,
}) => {
  const [editAccountDetails, setEditAccountDetails] = useState(true);
  const [editPersonalInfo, setEditPersonalInfo] = useState(true);
  const [saveChanges, setSaveChanges] = useState(false);
  const { setNotification } = useStateContext();
  const [noChange, setNoChange] = useState(false);

  const UpdateAdminUser = (ev) => {
    ev.preventDefault();
    setSaveChanges(true);
    setNotification(null);

    if (JSON.stringify(initial) === JSON.stringify(user)) {
      setNoChange(true);
      setTimeout(() => setNoChange(false), 300);
      setSaveChanges(false);
      return;
    }

    axiosClient
      .put(`/users/${user.id}`, initial)
      .then(() => {
        setNotification("User was successfully updated");
        setModalProfile(false);
        setSaveChanges(false);
        setEditAccountDetails(true);
        setEditPersonalInfo(true);
        setUser(initial);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };
  return (
    <>
      <section className=" font-raleway">
        <div
          ref={viewProfileBgRef}
          className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-50 backdrop-blur-xs"
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
          {userLoading && (
            <div className=" w-full py-20 text-center">
              <ClipLoader color="#101828" size={17} />
            </div>
          )}
          {!userLoading && (
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
                      className={`p-2 border rounded-sm shadow-sm transition-all duration-300 
                        ${
                          editPersonalInfo
                            ? "border-gray-400"
                            : "border-blue-600"
                        } 
                        ${noChange ? "shake border-red-500" : ""}
                      `}
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
                        className={`p-2 border rounded-sm shadow-sm transition-all duration-300 
                        ${
                          editPersonalInfo
                            ? "border-gray-400"
                            : "border-blue-600"
                        } 
                        ${noChange ? "shake border-red-500" : ""}
                      `}
                        type="text"
                        name="name"
                        id="name"
                        disabled={editPersonalInfo}
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
                      className={`p-2 border rounded-sm shadow-sm transition-all duration-300 
                        ${
                          editAccountDetails
                            ? "border-gray-400"
                            : "border-blue-600"
                        } 
                        ${noChange ? "shake border-red-500" : ""}
                      `}
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
                        className={`p-2 border rounded-sm shadow-sm transition-all duration-300 
                        ${
                          editAccountDetails
                            ? "border-gray-400"
                            : "border-blue-600"
                        } 
                        ${noChange ? "shake border-red-500" : ""}
                        `}
                        name="name"
                        id="name"
                        placeholder="Password"
                        disabled={editAccountDetails}
                        onChange={(ev) =>
                          setInitial({
                            ...initial,
                            password: ev.target.value,
                          })
                        }
                      />
                    </div>
                    <div className=" flex flex-col gap-1 w-full">
                      <h1 className=" text-xs font-semibold">
                        Confirm Password
                      </h1>
                      <input
                        className={` p-2 border transition-all duration-300 ${
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
                    {saveChanges ? (
                      <ClipLoader color="#fff" size={17} className=" m-auto" />
                    ) : (
                      "Save changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default ViewProfile;
