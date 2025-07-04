import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios-client";
import { PulseLoader } from "react-spinners";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdExit } from "react-icons/io";
import ViewProfile from "../../views/admin/sections/Operation/ViewProfile";

function Navbar() {
  const { user, token, setUser, setToken } = useStateContext();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isSetNav, setNav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openUser, isOpenUser] = useState(false);
  const [initial, setInitial] = useState();
  const [modalProfile, setModalProfile] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const viewProfileBgRef = useRef(null);
  const viewProfileRef = useRef(null);

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
    setUserLoading(true);
    axiosClient
      .get("/user")
      .then(({ data }) => {
        setUser(data);
        setInitial(user);
        setLoading(false);
        setUserLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const home = location.pathname.toLowerCase().includes("home");

  const viewProfile = () => {
    setModalProfile(true);
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

  return (
    <>
      {modalProfile && (
        <ViewProfile
          user={user}
          setUser={setUser}
          viewProfileRef={viewProfileRef}
          viewProfileBgRef={viewProfileBgRef}
          userLoading={userLoading}
          initial={initial}
          setInitial={setInitial}
          handleClose={handleClose}
          setModalProfile={setModalProfile}
        />
      )}
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
          <nav className="flex flex-row h-full justify-between mx-auto w-11/12 lg:w-11/12 xl:11/12 2xl:11/12">
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
              <ul className=" flex xl:flex-row text-white flex-col items-center gap-2 2xl:gap-8 xl:py-0 py-5 max-w-7xl">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/services">Services</Link>
                <Link to="/franchising">Franchising</Link>
                <Link to="/hotdeals">Hot Deals</Link>
                {token && user.role !== "admin" && (
                  <Link to="/appointment">Inquire/Book</Link>
                )}
                {!token && <Link to="/login">Inquire/Book</Link>}

                <Link to="/aboutus">About Us</Link>
                {user.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="cursor-pointer mx-6 bg-red-800 py-7 px-8 -skew-x-12 hover:mr-4 hover:ml-4 hover:px-10 duration-200"
                  >
                    Dashboard
                  </Link>
                )}
                {token ? (
                  <div className=" -ml-4">
                    <div className=" cursor-pointer p-1 hover:bg-gray-700 duration-100 rounded-full">
                      <CgProfile
                        onClick={() => isOpenUser(!openUser)}
                        size={23}
                        color="#f4f4f4"
                      />
                    </div>

                    {openUser && (
                      <div className="fixed mt-4 -ml-35 flex flex-col text-sm bg-gray-100 shadow-md text-gray-900 px-2 pb-2 rounded-sm">
                        <div className="flex flex-row py-2 border-b mb-2 gap-2 border-gray-300">
                          <div className=" h-10 w-10 rounded-full bg-gray-900"></div>
                          <div className=" flex flex-col my-auto font-semibold">
                            <h4>{user.name}</h4>
                            <h4>{user.role}</h4>
                          </div>
                        </div>
                        <div
                          onClick={viewProfile}
                          className="cursor-pointer flex flex-row py-1 gap-4 hover:bg-gray-200 px-1 rounded-sm"
                        >
                          <IoSettingsOutline className="  my-auto" />
                          <h4>Account Setting</h4>
                        </div>
                        <div
                          onClick={onLogout}
                          className="cursor-pointer flex flex-row py-1 gap-4 hover:bg-gray-200 px-1 rounded-sm"
                        >
                          <IoMdExit className="  my-auto" />
                          <h4>Logout</h4>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className=" flex flex-row h-full mx-2">
                    <Link
                      to="/login"
                      className="cursor-pointer mx-6 bg-red-800 py-7 px-8 -skew-x-12 hover:mr-4 hover:ml-4 hover:px-10 duration-200"
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
