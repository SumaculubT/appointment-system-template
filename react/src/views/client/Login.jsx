import React from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setLoading(false);
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };
  return (
    <div className="h-screen bg-gray-200 w-full">
      <div className=" h-full flex items-center">
        <div className="bg-white h-fit w-1/3 rounded-md shadow-md m-auto">
          <form
            className=" h-full flex flex-col gap-5 p-10 text-gray-900"
            onSubmit={onSubmit}
          >
            <h1 className=" text-center font-bold text-4xl mb-10">
              LOGIN YOUR ACCOUNT
            </h1>
            {errors && (
              <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <div className=" flex flex-col">
              <label className=" font-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                ref={emailRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className=" flex flex-col">
              <label className=" font-semibold" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                ref={passwordRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="w-full flex flex-col gap-4">
              <button
                className="bg-green-600 text-white py-3 rounded-md shadow-md hover:bg-green-700 duration-300"
                disabled={loading}
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Login"}
              </button>
              <div className=" flex justify-between">
                <div className=" flex flex-row gap-2">
                  <span className=" text-gray-600">Not Registered?</span>
                  <Link
                    to="/signup"
                    className=" text-gray-800 underline hover:text-gray-900 hover:scale-105 duration-300"
                  >
                    Create an account
                  </Link>
                </div>
                <Link
                  to="/signup"
                  className=" text-gray-700 underline hover:text-gray-900 hover:scale-105 duration-300"
                >
                  Forgot Password
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
