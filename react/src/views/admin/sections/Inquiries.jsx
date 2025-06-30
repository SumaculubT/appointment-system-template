import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../axios-client";
import dayjs from "dayjs";
import { FaCheck, FaTimes, FaUserLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader, PulseLoader } from "react-spinners";
import { TbHandStop } from "react-icons/tb";
import { BiCalendar } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";

const Inquiries = () => {
  const { inquiries, fetchInquiries, notification, setNotification } =
    useStateContext();
  const [initial, setInitial] = useState(null);
  const { user, setUser } = useStateContext();
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [addInqVisible, setaddInqVisible] = useState(false);
  const addNewRef = useRef(null);
  const addNewBgRef = useRef(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [waitListLoading, setWaitListLoading] = useState(false);
  const [noChange, setNoChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [inquiry, setInquiry] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_contact_number: "",
    vehicle_desc: "",
    plate_number: "",
    set_date: "",
    set_time: "",
    inquiry: "",
    status: "pending",
  });

  const buildInquiryPayload = (statusOverride = null) => ({
    plate_number: inquiry.plate_number,
    vehicle_desc: inquiry.vehicle_desc,
    set_date: inquiry.set_date,
    set_time: inquiry.set_time,
    user_id: inquiry.user_id,
    user_name: selectedInquiry.user_name,
    user_email: selectedInquiry.user_email,
    user_contact_number: selectedInquiry.user_contact_number,
    inquiry: selectedInquiry.inquiry,
    status: statusOverride ?? selectedInquiry.status,
  });

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
      setInquiry((prev) => ({
        ...prev,
        user_id: data.id,
      }));
    });
  }, []);

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

  const navigate = useNavigate();

  const viewDetailsRef = useRef(null);
  const viewDetailsBgRef = useRef(null);

  const getInquiries = (page = 1) => {
    setLoading(true);
    axiosClient
      .get(`/inquiry?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        fetchInquiries(data.data);
        setPagination({
          links: data.links,
          meta: data.meta,
        });
        setCurrentPage(data.meta.current_page);
        setSelectedPage(page);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to load inquiries:", err);
      });
  };
  useEffect(() => {
    getInquiries();
  }, []);

  const viewDetailsBtn = (inq) => {
    setSelectedInquiry(inq);
    setInquiry({
      plate_number: inq.plate_number,
      vehicle_desc: inq.vehicle_desc,
      set_date: inq.set_date,
      set_time: inq.set_time,
      status: inq.status,
    });
    setInitial(inquiry);
    setIsVisible(true);
    setTimeout(() => {
      viewDetailsRef.current.classList.remove("scale-0");
      viewDetailsRef.current.classList.add("scale-100");
      viewDetailsBgRef.current.classList.remove("scale-0");
      viewDetailsBgRef.current.classList.add("scale-100");
    }, 100);
  };

  const addNewInquiryBtn = () => {
    setaddInqVisible(true);
    setTimeout(() => {
      addNewRef.current.classList.remove("scale-0");
      addNewRef.current.classList.add("scale-100");
      addNewBgRef.current.classList.remove("scale-0");
      addNewBgRef.current.classList.remove("scale-100");
    }, 100);
  };
  const handleCloseNewInquiry = () => {
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

  const handleInquiryUpdate = async (
    ev,
    status = null,
    setLoading = null,
    successMessage = "Successfully saved."
  ) => {
    ev.preventDefault();
    setNotification(null);
    if ((status = null)) {
      if (JSON.stringify(inquiry) === JSON.stringify(selectedInquiry)) {
        setNoChange(true);
        setTimeout(() => setNoChange(false), 300);
        return;
      }
    }

    if (setLoading) setLoading(true);

    try {
      await axiosClient.put(
        `/inquiry/${selectedInquiry.id}`,
        buildInquiryPayload(status)
      );

      if (setLoading) setLoading(false);

      if (status) {
        setSelectedInquiry((prev) => ({ ...prev, status }));
      }

      setNotification(successMessage);
      setIsVisible(false);
      getInquiries();
      navigate("/dashboard/inquiries");
    } catch (err) {
      if (setLoading) setLoading(false);
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  const saveDetails = (ev) => handleInquiryUpdate(ev, null, setSaveLoading);
  const approve = (ev) =>
    handleInquiryUpdate(ev, "approved", setApproveLoading);
  const waitlist = (ev) =>
    handleInquiryUpdate(ev, "waitlisted", setWaitListLoading);
  const reject = (ev) => handleInquiryUpdate(ev, "rejected", setRejectLoading);

  const onDelete = (inq) => {
    setNotification(null);
    if (
      !window.confirm("Are you sure you want to delete this user: " + inq.id)
    ) {
      return;
    }
    setLoading(true);
    axiosClient.delete(`/inquiry/${inq.id}`).then(() => {
      setLoading(false);
      setNotification("Successfully deleted.");
      getInquiries();
    });
  };

  const handleClose = () => {
    viewDetailsRef.current.classList.add("scale-0");
    viewDetailsRef.current.classList.remove("scale-100");
    viewDetailsBgRef.current.classList.add("scale-0");
    viewDetailsBgRef.current.classList.remove("scale-100");
    setTimeout(() => {
      setIsVisible(false);
      document.body.classList.remove("overflow-hidden");
    }, 200);
  };
  const formatStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const infoGraph = [
    {
      name: "All Inquiries",
      num: "1,450 Inquiries",
      info: "+230 In this month",
    },
    { name: "Pending Inquiries", num: "10 Inquiries", info: "Current" },
    {
      name: "Approved Inquiries",
      num: "252 Inquiries",
      info: "+34 In this day",
    },
    { name: "Rejected Inquiries", num: "2 Inquiries", info: "+1 In this day" },
  ];

  const inqNav = [
    "All",
    "Approved",
    "Pending",
    "Waitlisted",
    "Rejected",
    "Archive",
  ];
  const [selectedInqNav, setSelectedInqNav] = useState(inqNav[2]);
  const filteredInquiries =
    selectedInqNav && selectedInqNav !== "All"
      ? inquiries.filter((inq) => inq.status === selectedInqNav.toLowerCase())
      : inquiries;

  const inqNavToggle = (selectedInq) => {
    setSelectedInqNav(selectedInq);
  };

  const addNewInquiry = (ev) => {
    ev.preventDefault();
    axiosClient
      .post("/inquiry", inquiry)
      .then(() => {
        getInquiries();
        setaddInqVisible(false);
        alert("Inquiry submitted successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit inquiry");
      });
  };

  const handleChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
    setInitial({ ...inquiry, [e.target.name]: e.target.value });
  };

  return (
    <>
      <section>
        <div className=" flex flex-row gap-4 justify-end mb-4 mr-10">
          <span className=" flex flex-row text-gray-800 py-2 px-8 border border-gray-800 shadow-sm rounded-sm font-semibold">
            <BiCalendar className=" h-full items-center mr-2" />
            January 17, 2025
          </span>
          <button
            onClick={addNewInquiryBtn}
            className=" cursor-pointer flex flex-row py-2 px-8 bg-blue-600 text-white shadow-sm rounded-sm font-semibold hover:bg-blue-800 duration-200"
          >
            <PiPlus className=" text-xl h-full items-center mr-2" />
            New Appointment
          </button>
        </div>
        <div className=" flex flex-row w-11/12 m-auto mb-10 gap-10">
          {infoGraph.map((i) => (
            <div className=" pr-6 py-4 shadow-sm bg-gray-100 w-full rounded-sm flex flex-col">
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
          {inqNav.map((i) => (
            <button
              key={i}
              onClick={() => inqNavToggle(i)}
              className={`pb-2 ${
                selectedInqNav === i
                  ? "text-blue-600 font-semibold border-b-2  border-blue-600"
                  : "text-gray-700"
              } hover:text-blue-600 transition-colors duration-200`}
            >
              {i}
            </button>
          ))}
        </div>
      </section>
      <section className="w-11/12 m-auto grid grid-cols-4 gap-5">
        {notification && (
          <div
            className={`fixed bottom-15 -right-4 z-50 bg-green-500 font-semibold text-xl -skew-x-12 text-white px-20 py-8 shadow-lg ${animationClass}`}
          >
            {notification}
          </div>
        )}
        {filteredInquiries.map((inq) => (
          <div
            key={inq.id}
            className="flex flex-col text-md h-fit bg-gray-100 rounded-md shadow-md py-5 px-6 "
          >
            <div className=" flex flex-row pb-4 mb-4 border-b border-gray-300">
              <span className=" flex flex-row w-full m-auto font-semibold text-md text-gray-900">
                <FaUserLock className=" my-auto mr-2 text-2xl" /> 000-00{inq.id}
              </span>
              <span
                className={` cursor-pointer w-fit py-2 text-sm font-semibold shadow-sm flex justify-end px-6 rounded-sm ${
                  inq.status === "pending"
                    ? "bg-indigo-50 text-indigo-600 border border-indigo-500"
                    : inq.status === "approved"
                    ? "bg-green-50 text-green-500 border border-green-500"
                    : inq.status === "rejected"
                    ? "bg-red-50 text-red-600 border border-red-500"
                    : "bg-yellow-50 text-yellow-500 border border-yellow-500"
                }`}
              >
                {formatStatus(inq.status)}
              </span>
            </div>

            <div className="flex justify-between border-b text-[15px] border-gray-300 pb-2 font-semibold text-gray-900">
              <div className=" flex flex-col gap-4">
                <div className=" flex flex-col">
                  <span className=" text-xs text-gray-600 mr-2">
                    Customer's Name
                  </span>
                  <span>{inq.user_name}</span>
                </div>
                <div className=" flex flex-col">
                  <span className=" text-xs text-gray-600 mr-2">Email</span>
                  <span>{inq.user_email}</span>
                </div>
              </div>

              <div className=" flex flex-col gap-4">
                <div className=" flex flex-col">
                  <span className=" text-xs text-gray-600 mr-2">
                    Telephone Number
                  </span>
                  <span>{inq.user_contact_number}</span>
                </div>
                <div className=" flex flex-col">
                  <span className=" text-xs text-gray-600 mr-2">
                    Preferred Schedule
                  </span>
                  <span>
                    {dayjs(`${inq.set_date} ${inq.set_time}`).format(
                      "D MMM, YYYY - h:mm A"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className=" flex flex-row w-full gap-4 text-gray-900 mt-4">
              <button
                onClick={(ev) => onDelete(inq)}
                className=" flex flex-row text-gray-900 bg-gray-100 border border-gray-500 gap-2 justify-center shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-1/3"
              >
                <FaTimes className=" my-auto text-xl" />
                <p>Delete</p>
              </button>
              <button
                onClick={() => viewDetailsBtn(inq)}
                className=" flex flex-row text-white bg-blue-600 gap-2 justify-center shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-2/3"
              >
                <FaCheck className=" my-auto text-xl" />
                <p>View Details</p>
              </button>
            </div>

            {isVisible && (
              <div
                ref={viewDetailsBgRef}
                className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-sm"
              ></div>
            )}

            {isVisible && (
              <div
                ref={viewDetailsRef}
                tabIndex={-1}
                className="fixed scale-0 pb-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
              >
                <div className=" flex justify-end h-fit w-full">
                  <FaTimes
                    onClick={handleClose}
                    className=" cursor-pointer text-xl m-2"
                  />
                </div>
                <form
                  onSubmit={saveDetails}
                  disabled={saveLoading}
                  className=" h-full flex px-10 flex-col text-gray-900"
                >
                  <h1 className=" text-center font-bold text-4xl mb-5">
                    Inquiry Details
                  </h1>
                  <div className="flex justify-between border-b w-full border-gray-300 pb-4 font-semibold text-gray-900">
                    <div className=" flex flex-col w-full gap-4">
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Customer's Name
                        </span>
                        <span>{selectedInquiry.user_name}</span>
                      </div>
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Telephone Number
                        </span>
                        <span>{selectedInquiry.user_contact_number}</span>
                      </div>
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Email
                        </span>
                        <span>{selectedInquiry.user_email}</span>
                      </div>
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Status
                        </span>
                        <span
                          className={` cursor-pointer w-fit py-1 text-sm font-semibold shadow-sm flex justify-end px-10 rounded-sm ${
                            selectedInquiry.status === "pending"
                              ? "bg-indigo-50 text-indigo-500 border border-indigo-500"
                              : selectedInquiry.status === "waitlisted"
                              ? "bg-yellow-50 text-yellow-500 border border-yellow-500"
                              : selectedInquiry.status === "approved"
                              ? "bg-green-50 text-green-500 border border-green-500"
                              : selectedInquiry.status === "rejected"
                              ? "bg-red-50 text-red-600 border border-red-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {formatStatus(selectedInquiry.status)}
                        </span>
                      </div>
                    </div>
                    <div className=" flex flex-col w-full gap-4">
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Vehicle Description
                        </span>
                        <span>{selectedInquiry.vehicle_desc}</span>
                      </div>
                      <div className=" flex flex-col">
                        <span className=" text-xs text-gray-600 mr-2">
                          Plate Number
                        </span>
                        <input
                          className={`border rounded px-2 py-1 transition-all duration-300 ${
                            noChange ? "shake" : "border-gray-300"
                          }`}
                          type="text"
                          name="plate_number"
                          id="plate_number"
                          value={inquiry.plate_number}
                          onChange={(ev) =>
                            setInquiry({
                              ...inquiry,
                              plate_number: ev.target.value,
                            })
                          }
                        />
                      </div>
                      <div className=" flex flex-col gap-1">
                        <span className=" text-xs text-gray-600 mr-2">
                          Preferred Schedule
                        </span>
                        <input
                          className={`border rounded px-2 transition-all duration-300 ${
                            noChange ? "shake" : "border-gray-300"
                          }`}
                          type="date"
                          name="set_date"
                          id="set_date"
                          value={inquiry.set_date}
                          onChange={(ev) =>
                            setInquiry({
                              ...inquiry,
                              set_date: ev.target.value,
                            })
                          }
                        />

                        <input
                          className={`border rounded px-2 transition-all duration-300 ${
                            noChange ? "shake" : "border-gray-300"
                          }`}
                          type="time"
                          name="set_time"
                          id="set_time"
                          value={inquiry.set_time}
                          onChange={(ev) =>
                            setInquiry({
                              ...inquiry,
                              set_time: ev.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" flex flex-col border-b border-gray-300 py-4 mb-4 font-semibold text-gray-900">
                    <span className=" text-xs text-gray-600 mr-2">
                      Inquiry:
                    </span>
                    <span>{selectedInquiry.inquiry}</span>
                  </div>

                  <button className=" flex flex-row text-blue-500 bg-blue-50 border border-blue-500 justify-center shadow-sm hover:scale-105 duration-300 py-2 rounded-sm">
                    {saveLoading ? (
                      <PulseLoader className="py-2" color="#155DFC" size={6} />
                    ) : (
                      "Save"
                    )}
                  </button>
                </form>
                <div className=" flex flex-row w-full px-10 gap-4 text-gray-900 mt-4">
                  <button
                    onClick={reject}
                    disabled={rejectLoading}
                    className="text-red-500 bg-red-50 border border-red-500 shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-1/2"
                  >
                    <div className="flex flex-row gap-2 w-full justify-center">
                      {rejectLoading ? (
                        <PulseLoader color="#dc2626" size={6} />
                      ) : (
                        <>
                          <FaTimes className="my-auto text-xl" />
                          <p>Reject</p>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={waitlist}
                    disabled={waitListLoading}
                    className="text-yellow-500 bg-yellow-50 border border-yellow-500 shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-1/2"
                  >
                    <div className="flex flex-row gap-2 w-full justify-center">
                      {waitListLoading ? (
                        <PulseLoader color="#f59e0b" size={6} />
                      ) : (
                        <>
                          <TbHandStop className="my-auto text-xl" />
                          <p>Wait list</p>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={approve}
                    disabled={approveLoading}
                    className="text-green-500 bg-green-50 border border-green-500 shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-1/2"
                  >
                    <div className="flex flex-row gap-2 w-full justify-center">
                      {approveLoading ? (
                        <PulseLoader color="#059669" size={6} />
                      ) : (
                        <>
                          <FaCheck className="my-auto text-xl" />
                          <p>Approve</p>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
      <section>
        {pagination.meta && pagination.meta.last_page > 1 && (
          <nav>
            <ul className=" flex flex-row gap-2 w-11/12 m-auto h-full justify-end mt-10">
              {pagination.links.prev && (
                <li>
                  <button
                    className=" cursor-pointer font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() => getInquiries(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
              )}

              {pagination.meta.links.map((link, index) => {
                if (
                  link.label === "&laquo; Previous" ||
                  link.label === "Next &raquo;"
                ) {
                  return null;
                }

                const pageNumber = parseInt(link.label);
                const isCurrent = link.active;
                const isDisabled = !link.url;

                return (
                  <li key={index}>
                    <button
                      onClick={() => getInquiries(pageNumber)}
                      className={` cursor-pointer px-4 py-2 rounded-sm border border-gray-900  shadow-sm hover:text-white hover:bg-gray-900 duration-300 ${
                        isCurrent ? "text-white bg-gray-900" : "text-gray-900"
                      }`}
                      disabled={isDisabled || isCurrent}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}

              {pagination.links.next && (
                <li>
                  <button
                    className=" cursor-pointer font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() => getInquiries(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </section>
      <section>
        {addInqVisible && (
          <div
            ref={addNewBgRef}
            className="fixed scale-0 inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-sm"
          ></div>
        )}
        {addInqVisible && (
          <div
            ref={addNewRef}
            className="fixed scale-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/2 z-50 duration-200"
          >
            <div className=" flex justify-end h-fit w-full">
              <FaTimes
                onClick={handleCloseNewInquiry}
                className=" cursor-pointer text-xl m-2"
              />
            </div>
            <form
              onSubmit={addNewInquiry}
              className="flex flex-col w-11/12 m-auto mb-6"
            >
              <h1 className="text-2xl text-center font-semibold  text-gray-900  mb-10">
                Add New Appointment
              </h1>

              <div className=" flex justify-between gap-4 w-full">
                <div className=" flex flex-col w-full">
                  <div className="flex flex-col py-3">
                    <label
                      className="text-md font-semibold"
                      htmlFor="user_name"
                    >
                      Name
                    </label>
                    <input
                      value={inquiry.user_name}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm"
                      type="text"
                      name="user_name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <label className="text-md font-semibold" htmlFor="email">
                      Email
                    </label>
                    <input
                      value={inquiry.user_email}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm"
                      type="email"
                      name="user_email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <label
                      className="text-md font-semibold"
                      htmlFor="user_contact_number"
                    >
                      Contact Number
                    </label>
                    <input
                      value={inquiry.user_contact_number}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm"
                      type="text"
                      name="user_contact_number"
                      placeholder="Contact Number"
                    />
                  </div>
                </div>
                {/* --- */}
                <div className=" flex flex-col w-full">
                  <div className="flex flex-col w-full py-3">
                    <label
                      className="text-md font-semibold"
                      htmlFor="vehicle_desc"
                    >
                      Vehicle Year, Make and Model
                    </label>
                    <input
                      value={inquiry.vehicle_desc}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm"
                      type="text"
                      name="vehicle_desc"
                      placeholder="Your Vehicle"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <label
                      className="text-md font-semibold"
                      htmlFor="plate_number"
                    >
                      Plate Number
                    </label>
                    <input
                      value={inquiry.plate_number}
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm"
                      type="text"
                      name="plate_number"
                      placeholder="Plate Number"
                    />
                  </div>
                  <div className=" flex flex-row gap-2 ">
                    <div className="flex flex-col py-3 w-full">
                      <label
                        className="text-md font-semibold"
                        htmlFor="set_date"
                      >
                        Preferred Date
                      </label>
                      <input
                        value={inquiry.set_date}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 shadow-sm"
                        type="date"
                        name="set_date"
                      />
                    </div>

                    <div className="flex flex-col py-3 w-full">
                      <label
                        className="text-md font-semibold"
                        htmlFor="set_time"
                      >
                        Preferred Time
                      </label>
                      <input
                        value={inquiry.set_time}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 shadow-sm"
                        type="time"
                        name="set_time"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col py-3">
                <label className="text-md font-semibold" htmlFor="inquiry">
                  Inquiry
                </label>
                <textarea
                  value={inquiry.inquiry}
                  onChange={handleChange}
                  rows={5}
                  className="p-2 border border-gray-300 shadow-sm"
                  name="inquiry"
                  placeholder="Write your inquiry here..."
                />
              </div>

              <div className=" w-full flex justify-end">
                <button
                  className=" cursor-pointer py-2 px-10 w-fit bg-green-600 font-semibold text-white shadow-sm"
                  type="submit"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </>
  );
};

export default Inquiries;
