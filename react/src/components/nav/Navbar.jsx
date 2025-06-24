import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";
import { PulseLoader } from "react-spinners";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isSetNav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogout = (ev) => {
    ev.preventDefault();
    setLoading(true);
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
      setLoading(false);
    });
  };

  const toggleMenu = () => {
    setNav(!isSetNav);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  });

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/user")
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const { user, token, setUser, setToken } = useStateContext();
  const home = location.pathname.toLowerCase().includes("home");

  return (
    <>
      {loading && (
        <div className="fixed h-screen w-full bg-[rgba(16,24,33,0.3)] backdrop-blur-sm z-50 flex items-center justify-center">
          <PulseLoader color="#9F0712" size={10} />
        </div>
      )}
      {!loading && (
        <div
          className={`fixed font-raleway top-0 w-full h-20 z-40 transition-colors duration-700 ${
            scrolled || !home ? "bg-gray-900 shadow-xl" : "bg-transparent "
          }`}
          id="navbar"
        >
          <nav className="flex flex-row h-full justify-between mx-auto w-11/12 lg:w-11/12 xl:11/12 2xl:w-3/4">
            <div className="h-full">
              <Link to="/" className="flex h-full flex-row">
                <h1 className=" text-white text-2xl font-bold m-auto">
                  AUTOMOTIVE
                </h1>
              </Link>
            </div>
            <GiHamburgerMenu
              id="burger"
              onClick={toggleMenu}
              className="flex visible xl:hidden 2xl:hidden my-auto text-3xl text-white cursor-pointer hover:text-gray-900 ease-in-out duration-300"
            />
            <div
              id="nav"
              className={`xl:h-fit ${
                isSetNav ? "h-fit" : "h-0"
              } overflow-hidden absolute xl:relative 2xl:relative xl:my-auto mt-20 bg-[rgba(57,57,198,0.7)] bg-opacity-80 xl:bg-transparent w-full xl:w-fit left-0 z-20 duration-300 flex xl:justify-center justify-start`}
            >
              <ul className=" flex xl:flex-row text-white flex-col items-center gap-2 2xl:gap-10 xl:py-0 py-5 max-w-7xl">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/services">Services</Link>
                <Link to="/franchising">Franchising</Link>
                <Link to="/hotdeals">Hot Deals</Link>
                {user.role !== "admin" && (
                  <Link to="/appointment">Inquire/Book</Link>
                )}
                <Link to="/aboutus">About Us</Link>
                {user.role === "admin" && (
                  <Link to="/dashboard">Dashboard</Link>
                )}
                {token ? (
                  <div className=" flex flex-row">
                    <button
                      onClick={onLogout}
                      className="cursor-pointer mx-6 bg-red-800 py-7 px-8 -skew-x-12 hover:mr-4 hover:px-10 duration-200"
                    >
                      Logout
                    </button>
                    <p className="text-white m-auto"> Tanginamo! {user.name}</p>
                  </div>
                ) : (
                  <div className=" flex flex-row h-full gap-2 mx-2">
                    <Link
                      to="/login"
                      className="cursor-pointer bg-red-800 py-7 px-8 -skew-x-12 hover:px-10 duration-200"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="cursor-pointer flex items-center"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </ul>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export default Navbar;
