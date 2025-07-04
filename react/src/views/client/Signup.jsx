import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { GoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const contact_numberRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      contact_number: contact_numberRef.current.value,
      role: "user",
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setLoading(false);
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        setLoading(false);
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };
  return (
    <div className="h-screen bg-gray-200 w-full pt-20">
      <div className=" h-full flex items-center">
        <div className="bg-white h-fit w-1/4 rounded-md shadow-md m-auto">
          <form
            className=" h-full flex flex-col gap-3 p-10 text-gray-900"
            onSubmit={onSubmit}
          >
            <h1 className=" text-center font-semibold text-4xl mb-10">
              Sign up
            </h1>
            {errors && (
              <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <div className=" flex flex-col">
              <label className=" font-semibold text-sm" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                ref={nameRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                placeholder="Full Name"
              />
            </div>
            <div className=" flex flex-col">
              <label className=" font-semibold text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                ref={emailRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                type="email"
                placeholder="Email Address"
              />
            </div>
            <div className=" flex flex-col">
              <label
                className=" font-semibold text-sm"
                htmlFor="contact_number"
              >
                Contact Number
              </label>
              <input
                id="contact_number"
                ref={contact_numberRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                placeholder="Contact Number"
              />
            </div>
            <div className=" flex flex-col">
              <label className=" font-semibold text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                ref={passwordRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className=" flex flex-col">
              <label
                className=" font-semibold text-sm"
                htmlFor="password_confirmation"
              >
                Confim Password
              </label>
              <input
                id="password_confirmation"
                ref={passwordConfirmationRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="w-full flex flex-col gap-4 text-sm">
              <div className=" flex flex-row justify-between gap-2">
                <GoogleLogin
                  size="large"
                  text="continue_with"
                  logo_alignment="center"
                  width="280px"
                />
                <button className="bg-blue-600 w-full text-white font-semibold py-1 rounded-sm shadow-md hover:bg-blue-800 duration-100">
                  {loading ? <ClipLoader color="#fff" size={20} /> : "Sign up"}
                </button>
              </div>
              <div className=" flex flex-row gap-2">
                <span className=" text-gray-600 ">Already Registered?</span>
                <Link
                  to="/login"
                  className=" text-gray-800 underline hover:bg-gray-200 px-2 rounded-sm duration-100"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
