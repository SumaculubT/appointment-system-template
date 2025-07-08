import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../../axios-client";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { ClipLoader, PulseLoader } from "react-spinners";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    contact_number: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveloading, setSaveLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setSaveLoading(true);
    axiosClient
      .put(`/users/${user.id}`, user)
      .then(() => {
        setSaveLoading(false);
        setNotification("User was successfully updated");
        navigate("/dashboard/accounts");
      })
      .catch((err) => {
        setSaveLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };
  return (
    <>
      {loading && (
        <div className="h-[78vh] w-full flex items-center justify-center">
          <PulseLoader color="#9F0712" size={5} />
        </div>
      )}
      {!loading && (
        <section key={id} className=" w-11/12 h-full m-auto">
          <div className=" flex flex-col w-1/2 p-10 m-auto bg-gray-100 rounded-lg shadow-md">
            <h1 className=" text-3xl font-semibold mb-2">
              Edit User's Information
            </h1>
            <h2 className="text-md mb-10">User ID: {user.id}</h2>
            {errors && (
              <div className="w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm mb-4">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <form className=" flex flex-col gap-4" onSubmit={onSubmit}>
              <div></div>
              <input
                className="p-4 border border-gray-500 rounded-md"
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="Name"
              />
              <input
                className="p-4 border border-gray-500 rounded-md"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email"
              />
              <input
                className="p-4 border border-gray-500 rounded-md"
                value={user.contact_number}
                onChange={(ev) =>
                  setUser({ ...user, contact_number: ev.target.value })
                }
                placeholder="Contact Number"
              />
              <input
                className="p-4 border border-gray-500 rounded-md"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder="Password"
              />
              <input
                className="p-4 border border-gray-500 rounded-md"
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Password Confirmation"
              />
              <button
                className=" cursor-pointer py-3  bg-green-600 text-white rounded-md"
                disabled={saveloading}
              >
                {saveloading ? <ClipLoader color="#fff" size={20} /> : "Save"}
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default UpdateUser;
