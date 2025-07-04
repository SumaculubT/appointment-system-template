import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { useRef, useState, useEffect } from "react"; // Import useEffect
import { ClipLoader } from "react-spinners";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);
  const { setUser, setToken } = useStateContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // --- Start: Handle Laravel Redirect for Google Login ---
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const user = queryParams.get("user");
    const error = queryParams.get("error");

    if (token && user) {
      setToken(token);
      setUser(JSON.parse(decodeURIComponent(user)));
      navigate("/dashboard"); // Redirect to dashboard or home page
    } else if (error) {
      setErrors({ google: [decodeURIComponent(error)] });
    }
  }, [setToken, setUser, navigate]);
  // --- End: Handle Laravel Redirect for Google Login ---

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
        navigate("/dashboard"); // Redirect after successful traditional login
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
        } else if (response && response.status === 401) {
          setErrors({ email: ["The provided credentials are incorrect."] });
        }
      });
  };

  // --- Start: Google Login Handler ---
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    setErrors(null);
    try {
      // Send the Google ID token to your Laravel backend
      const { data } = await axiosClient.post("/auth/google/callback/token", {
        token: credentialResponse.credential, // This is the ID token from Google
      });

      setLoading(false);
      setUser(data.user);
      setToken(data.token);
      navigate("/dashboard"); // Redirect after successful Google login
    } catch (error) {
      setLoading(false);
      const response = error.response;
      if (response && response.data && response.data.message) {
        setErrors({ google: [response.data.message] });
      } else {
        setErrors({ google: ["Google login failed. Please try again."] });
      }
      console.error("Google login error:", error);
    }
  };

  const handleGoogleLoginError = () => {
    setErrors({ google: ["Google login failed. Please try again."] });
    console.log("Login Failed");
  };

  return (
    <div className="h-screen bg-gray-200 w-full">
      <div className=" h-full flex items-center">
        <div className="bg-white h-fit w-1/4 rounded-md shadow-md m-auto">
          <form
            className=" h-full flex flex-col gap-5 p-10 text-gray-900"
            onSubmit={onSubmit}
          >
            <h1 className=" text-center font-semibold text-4xl mb-5">Login</h1>
            {errors && (
              <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            <div className=" flex flex-col">
              <label className=" font-semibold text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                ref={emailRef}
                className=" p-2 rounded border border-gray-300 shadow-sm text-md"
                type="email"
                placeholder="Email"
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
            <div className="w-full flex flex-col gap-2">
              <div className=" flex flex-row justify-between gap-2">
                <div className=" h-full w-full my-auto">
                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    size="large"
                    text="continue_with"
                    logo_alignment="center"
                    width="280px"
                  />
                </div>

                <button
                  className="bg-blue-600 text-sm font-semibold w-full text-white py-1 rounded-sm shadow-md hover:bg-blue-800 duration-100"
                  disabled={loading}
                >
                  {loading ? <ClipLoader color="#fff" size={20} /> : "Login"}
                </button>
              </div>

              <div className=" flex justify-between items-center text-sm">
                {/* Added items-center for better alignment */}
                <div className=" flex flex-row gap-2">
                  <span className=" text-gray-600">Not Registered?</span>
                  <Link
                    to="/signup"
                    className=" text-gray-700 underline hover:text-gray-900 hover:bg-gray-200 px-2 rounded-sm duration-300"
                  >
                    Create an account
                  </Link>
                </div>
                <Link
                  to="/signup" // Should this be to /forgot-password or something similar? Signup is already covered
                  className=" text-gray-700 underline hover:text-gray-900 hover:bg-gray-200 px-2 rounded-sm duration-300"
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
