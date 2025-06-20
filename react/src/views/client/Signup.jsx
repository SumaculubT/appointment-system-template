import React from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState } from "react";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const contact_numberRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      contact_number: contact_numberRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };
  return (
    <div className="h-screen bg-gray-200 w-full pt-20">
      <div className=" h-full flex items-center">
        <div className="bg-white h-fit w-1/3 rounded-md shadow-md m-auto">
          <form
            className=" h-full flex flex-col gap-3 p-10 text-gray-900"
            onSubmit={onSubmit}
          >
            <h1 className=" text-center font-bold text-4xl mb-10">
              SIGN UP FOR FREE
            </h1>
            {errors && (
              <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <div className=" flex flex-col">
              <label className=" font-semibold" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                ref={nameRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
                placeholder="Full Name"
              />
            </div>
            <div className=" flex flex-col">
              <label className=" font-semibold" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                ref={emailRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
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
                ref={contact_numberRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
                placeholder="Contact Number"
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
            <div className=" flex flex-col">
              <label className=" font-semibold" htmlFor="password_confirmation">
                Confim Password
              </label>
              <input
                id="password_confirmation"
                ref={passwordConfirmationRef}
                className=" p-2 rounded border border-gray-500 shadow-sm text-md"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="w-full flex flex-col gap-4">
              <button className="bg-green-600 text-white py-3 rounded-md shadow-md hover:bg-green-700 duration-300">
                Signup
              </button>
              <div className=" flex flex-row gap-2">
                <span className=" text-gray-600">Already Registered?</span>
                <Link
                  to="/login"
                  className=" text-gray-800 underline hover:text-gray-900 hover:scale-105 duration-300"
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
