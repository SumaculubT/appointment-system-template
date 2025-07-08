import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../axios-client";
import dayjs from "dayjs";
import { FaCheck, FaTimes, FaUserLock } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClipLoader, PulseLoader } from "react-spinners";
import { TbHandStop } from "react-icons/tb";
import { BiCalendar } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { LiaEllipsisHSolid, LiaTimesSolid } from "react-icons/lia";

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
  const [addNewLoading, setAddNewLoading] = useState(false);
  const [noChange, setNoChange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [errors, setErrors] = useState(null);
  const [selectedInqNav, setSelectedInqNav] = useState("All");
  const [today, setToday] = useState(getFormattedDate());
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
    status: "approved",
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

  const getInquiries = (page = 1, status = selectedInqNav) => {
    setLoading(true);

    axiosClient
      .get(`/inquiry`, {
        params: {
          page,
          status: status.toLowerCase(),
        },
      })
      .then(({ data }) => {
        setLoading(false);
        fetchInquiries(data.data);
        setPagination({
          links: data.meta?.pagination?.links || [],
          meta: data.meta?.pagination,
        });
        setCounts(data.counts);
        setCurrentPage(data.meta?.pagination?.current_page);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Failed to load inquiries:", err);
      });
  };

  useEffect(() => {
    getInquiries(1, selectedInqNav);
  }, [selectedInqNav]);

  const viewDetailsBtn = (inq) => {
    setSelectedInquiry(inq);
    setInquiry({
      plate_number: inq.plate_number,
      vehicle_desc: inq.vehicle_desc,
      set_date: inq.set_date,
      set_time: inq.set_time,
      status: inq.status,
    });
    setInitial({
      plate_number: inq.plate_number,
      vehicle_desc: inq.vehicle_desc,
      set_date: inq.set_date,
      set_time: inq.set_time,
      status: inq.status,
    });

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

    if (!status) {
      if (JSON.stringify(initial) === JSON.stringify(inquiry)) {
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

  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
    archived: 0,
    this_month_total: 0,
    today_approved: 0,
    today_rejected: 0,
  });

  const infoGraph = [
    {
      name: "All Inquiries",
      num: `${counts.total} Inquiries`,
      info: `${counts.this_month_total} In this month`,
    },
    {
      name: "Pending Inquiries",
      num: `${counts.pending} Inquiries`,
      info: "Current",
    },
    {
      name: "Approved Inquiries",
      num: `${counts.approved} Inquiries`,
      info: `${counts.today_approved} In this day`,
    },
    {
      name: "Rejected Inquiries",
      num: `${counts.rejected} Inquiries`,
      info: `${counts.today_rejected} In this day`,
    },
  ];

  const inqNav = [
    "All",
    "Approved",
    "Pending",
    "Waitlisted",
    "Rejected",
    "Archive",
  ];

  const filteredInquiries =
    selectedInqNav !== "All"
      ? inquiries.filter((inq) => inq.status === selectedInqNav.toLowerCase())
      : inquiries;

  const addNewInquiry = (ev) => {
    ev.preventDefault();
    setAddNewLoading(true);
    axiosClient
      .post("/inquiry", inquiry)
      .then(() => {
        getInquiries();
        setaddInqVisible(false);
        setNotification("Successfuly Added");
        setAddNewLoading(false);
      })
      .catch((err) => {
        const response = err.response;
        setAddNewLoading(false);
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          }
        }
      });
  };

  const handleChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
    setInitial({ ...inquiry, [e.target.name]: e.target.value });
  };

  function getFormattedDate() {
    return new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setToday(getFormattedDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section>
        <div className=" flex flex-row gap-4 justify-end mb-4 mr-10">
          <span className="flex flex-row text-gray-800 py-2 px-8 border border-gray-800 shadow-sm rounded-sm font-semibold">
            <BiCalendar className="h-full items-center mr-2" />
            {today}
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
            <div
              key={i.name}
              className=" cursor-pointer pr-6 py-4 shadow-sm bg-gray-100 w-full rounded-sm flex flex-col hover:scale-101 duration-300"
            >
              <h3 className=" text-gray-500 text-sm pl-6 font-semibold">
                {i.name}
              </h3>
              <h1 className=" text-gray-800 border-l-3 pl-6 py-2 border-blue-600 text-2xl font-semibold">
                {counts.total === 0 ? (
                  <PulseLoader color="#364153" size={4} />
                ) : (
                  i.num
                )}
              </h1>
              <h2 className=" text-green-600 pl-6 text-sm font-semibold">
                {counts === 0 ? (
                  <PulseLoader color="#364153" size={4} />
                ) : (
                  i.info
                )}
              </h2>
            </div>
          ))}
        </div>
        <div className=" flex flex-row border-b gap-6 text-sm font-semibold border-gray-400 w-11/12 m-auto mb-4">
          {inqNav.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedInqNav(status)}
              className={`px-2 py-1 hover:text-blue-500 ${
                selectedInqNav === status
                  ? "text-blue-600 border-b-2"
                  : "text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </section>
      {loading && (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <PulseLoader color="#9F0712" size={6} />
        </div>
      )}
      <section className="w-11/12 m-auto grid grid-cols-4 gap-4">
        {notification && (
          <div
            className={`fixed bottom-15 -right-4 z-50 bg-green-500 font-semibold text-xl -skew-x-12 text-white px-20 py-8 shadow-lg ${animationClass}`}
          >
            {notification}
          </div>
        )}
        {!loading &&
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="flex flex-col text-md h-fit bg-gray-100 rounded-md shadow-md py-5 px-6 "
            >
              <div className=" flex flex-row pb-4 mb-4 border-b border-gray-300">
                <span className=" flex flex-row font-semibold w-full m-auto text-sm text-gray-900">
                  <FaUserLock className=" my-auto mr-2 text-xl" /> 000-00
                  {inq.id}
                </span>
                <span
                  className={` cursor-pointer w-fit py-2 text-xs font-semibold flex justify-end px-6 rounded-sm ${
                    inq.status === "pending"
                      ? "text-indigo-500 border border-indigo-500"
                      : inq.status === "approved"
                      ? "text-green-500 border border-green-500"
                      : inq.status === "rejected"
                      ? "text-red-500 border border-red-500"
                      : "text-yellow-500 border border-yellow-500"
                  }`}
                >
                  {formatStatus(inq.status)}
                </span>
              </div>

              <div className="flex justify-between border-b text-[15px] border-gray-300 pb-2 text-gray-800">
                <div className=" flex flex-col gap-4">
                  <div className=" flex flex-col">
                    <span className=" text-xs font-semibold text-gray-600 mr-2">
                      Customer's Name
                    </span>
                    <span className="text-sm">{inq.user_name}</span>
                  </div>
                  <div className=" flex flex-col">
                    <span className=" text-xs font-semibold text-gray-600 mr-2">
                      Email
                    </span>
                    <span className="text-sm">{inq.user_email}</span>
                  </div>
                </div>

                <div className=" flex flex-col gap-4">
                  <div className=" flex flex-col">
                    <span className=" text-xs font-semibold text-gray-600 mr-2">
                      Telephone Number
                    </span>
                    <span className="text-sm">{inq.user_contact_number}</span>
                  </div>
                  <div className=" flex flex-col">
                    <span className=" text-xs font-semibold text-gray-600 mr-2">
                      Preferred Schedule
                    </span>
                    <span className="text-sm">
                      {dayjs(`${inq.set_date} ${inq.set_time}`).format(
                        "D MMM, YYYY - h:mm A"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className=" flex flex-row w-full gap-2 text-sm mt-4">
                <button
                  onClick={(ev) => onDelete(inq)}
                  className=" flex flex-row text-gray-700 border border-gray-500 gap-2 justify-center shadow-sm hover:bg-gray-500 hover:text-white duration-100 py-2 rounded-sm w-1/3"
                >
                  <FaTimes className=" my-auto text-xl" />
                  <p>Delete</p>
                </button>
                <button
                  onClick={() => viewDetailsBtn(inq)}
                  className=" flex flex-row text-white bg-blue-600 gap-2 justify-center shadow-sm hover:bg-blue-700 duration-100 py-2 rounded-sm w-2/3"
                >
                  <FaCheck className=" my-auto text-xl" />
                  <p>View Details</p>
                </button>
              </div>

              {isVisible && (
                <div
                  ref={viewDetailsBgRef}
                  className="fixed scale-0  inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-xs"
                ></div>
              )}

              {isVisible && (
                <div
                  ref={viewDetailsRef}
                  tabIndex={-1}
                  className="fixed scale-0 pb-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
                >
                  <div className=" flex justify-between h-fit w-full p-2 ">
                    <h1 className=" text-gray-900 text-xl font-bold">
                      Inquiry Details
                    </h1>
                    <LiaTimesSolid
                      onClick={handleClose}
                      className=" cursor-pointer text-gray-600 text-2xl"
                    />
                  </div>
                  <form
                    onSubmit={saveDetails}
                    disabled={saveLoading}
                    className=" h-full flex w-11/12 flex-col text-gray-900 m-auto"
                  >
                    <div className="flex justify-between border-b w-full border-t py-5 border-gray-300 pb-4 text-gray-900">
                      <div className=" flex flex-col w-full gap-4">
                        <div className=" flex flex-col">
                          <h1 className=" text-xs font-semibold">
                            Customer's Name
                          </h1>
                          <span>{selectedInquiry.user_name}</span>
                        </div>
                        <div className=" flex flex-col">
                          <h1 className=" text-xs font-semibold">
                            Telephone Number
                          </h1>
                          <span>{selectedInquiry.user_contact_number}</span>
                        </div>
                        <div className=" flex flex-col">
                          <h1 className=" text-xs font-semibold">Email</h1>
                          <span>{selectedInquiry.user_email}</span>
                        </div>
                        <div className=" flex flex-col">
                          <h1 className=" text-xs font-semibold">Status</h1>
                          <span
                            className={` cursor-pointer w-fit py-1 text-s shadow-sm flex justify-end px-10 rounded-sm ${
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
                          <h1 className=" text-xs font-semibold">
                            Vehicle Description
                          </h1>
                          <span>{selectedInquiry.vehicle_desc}</span>
                        </div>
                        <div className=" flex flex-col">
                          <h1 className=" text-xs font-semibold">
                            Plate Number
                          </h1>
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
                          <h1 className=" text-xs font-semibold">
                            Preferred Schedule
                          </h1>
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
                    <div className=" flex flex-col border-b border-gray-300 py-2 mb-4 text-gray-900">
                      <h1 className=" text-gray-900 text-lg font-bold pb-2">
                        Inquiry
                      </h1>
                      <span className="text-sm">{selectedInquiry.inquiry}</span>
                    </div>

                    <button className=" flex flex-row text-white bg-blue-500 justify-center shadow-sm hover:bg-blue-600 duration-100 py-2 rounded-sm">
                      {saveLoading ? (
                        <PulseLoader className="py-2" color="#fff" size={6} />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </form>
                  <div className=" flex flex-row w-11/12 m-auto gap-2 text-gray-900 mt-2">
                    <button
                      onClick={reject}
                      disabled={rejectLoading}
                      className="text-white bg-red-500 shadow-sm hover:bg-red-600 duration-100 py-2 rounded-sm w-1/2"
                    >
                      <div className="flex flex-row gap-2 w-full justify-center">
                        {rejectLoading ? (
                          <PulseLoader color="#fff" size={5} />
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
                      className="text-white bg-yellow-500 shadow-sm hover:bg-yellow-600 duration-100 py-2 rounded-sm w-1/2"
                    >
                      <div className="flex flex-row gap-2 w-full justify-center">
                        {waitListLoading ? (
                          <PulseLoader color="#fff" size={5} />
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
                      className="text-white bg-green-500 shadow-sm hover:bg-green-600 duration-100 py-2 rounded-sm w-1/2"
                    >
                      <div className="flex flex-row gap-2 w-full justify-center">
                        {approveLoading ? (
                          <PulseLoader color="#fff" size={5} />
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
            <ul className=" flex flex-row gap-2 w-11/12 m-auto h-full justify-center mt-10">
              {pagination?.meta?.current_page !== 1 && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold text-sm py-2 hover:scale-105 duration-300"
                    onClick={() => getInquiries(1, selectedInqNav)}
                  >
                    {"<< First"}
                  </button>
                </li>
              )}

              {pagination?.meta?.current_page > 1 && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(currentPage - 1, selectedInqNav)
                    }
                  >
                    Previous
                  </button>
                </li>
              )}

              {pagination.meta &&
                (() => {
                  const totalPages = pagination.meta.last_page;
                  const currentPage = pagination.meta.current_page;
                  const pageButtons = [];

                  const createPageButton = (page) => (
                    <li key={page}>
                      <button
                        onClick={() => getInquiries(page)}
                        className={`cursor-pointer px-3 py-1 rounded-sm border border-gray-900 shadow-sm hover:text-white hover:bg-gray-900 duration-300 ${
                          currentPage === page
                            ? "text-white bg-gray-900"
                            : "text-gray-900"
                        }`}
                        disabled={currentPage === page}
                      >
                        {page}
                      </button>
                    </li>
                  );

                  // Always show first page
                  pageButtons.push(createPageButton(1));

                  // Show "..." if current page > 3
                  if (currentPage > 4) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Show pages around the current page
                  for (
                    let i = Math.max(2, currentPage - 2);
                    i <= Math.min(totalPages - 1, currentPage + 2);
                    i++
                  ) {
                    pageButtons.push(createPageButton(i));
                  }

                  // Show "..." before last page
                  if (currentPage < totalPages - 3) {
                    pageButtons.push(
                      <LiaEllipsisHSolid
                        className=" mt-4 text-gray-900"
                        size={20}
                      />
                    );
                  }

                  // Always show last page if more than one page
                  if (totalPages > 1) {
                    pageButtons.push(createPageButton(totalPages));
                  }

                  return pageButtons;
                })()}

              {pagination?.meta?.current_page < pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-gray-800 font-semibold px-4 py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(currentPage + 1, selectedInqNav)
                    }
                  >
                    Next
                  </button>
                </li>
              )}
              {pagination?.meta?.current_page !==
                pagination?.meta?.last_page && (
                <li>
                  <button
                    className="cursor-pointer text-sm text-gray-800 font-semibold py-2 hover:scale-105 duration-300"
                    onClick={() =>
                      getInquiries(pagination.meta.last_page, selectedInqNav)
                    }
                  >
                    {"Last >>"}
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
            className="fixed scale-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/3 z-50 duration-200"
          >
            <div className=" flex justify-between h-fit w-full p-2 ">
              <h1 className=" text-gray-900 text-xl font-bold">
                Add New Appointment
              </h1>
              <LiaTimesSolid
                onClick={handleCloseNewInquiry}
                className=" cursor-pointer text-gray-600 text-2xl"
              />
            </div>
            {errors && (
              <>
                <div className=" w-11/12 m-auto p-2 rounded-md shadow-md bg-red-500 text-white text-sm">
                  <div className=" w-full flex justify-end">
                    <LiaTimesSolid
                      color="#fff"
                      onClick={() => {
                        setErrors(null);
                      }}
                      className=" cursor-pointer text-gray-600 text-xl"
                    />
                  </div>

                  {Object.keys(errors).map((key) => (
                    <p key={key}>{errors[key][0]}</p>
                  ))}
                </div>
              </>
            )}
            <form
              onSubmit={addNewInquiry}
              className="flex flex-col w-11/12 m-auto border-t border-gray-300 py-2 mb-6"
            >
              <div className=" flex justify-between gap-4 w-full">
                <div className=" flex flex-col w-full">
                  <div className="flex flex-col py-3">
                    <h1 className=" text-xs font-semibold">Full Name</h1>
                    <input
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm rounded-sm"
                      type="text"
                      name="user_name"
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <h1 className=" text-xs font-semibold">Email</h1>
                    <input
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm rounded-sm"
                      type="email"
                      name="user_email"
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <h1 className=" text-xs font-semibold">Contact Number</h1>
                    <input
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm rounded-sm"
                      type="text"
                      name="user_contact_number"
                      placeholder="Contact Number"
                    />
                  </div>
                </div>
                <div className=" flex flex-col w-full">
                  <div className="flex flex-col w-full py-3">
                    <h1 className=" text-xs font-semibold">
                      Vehicle Year, Make and Model
                    </h1>
                    <input
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm rounded-sm"
                      type="text"
                      name="vehicle_desc"
                      placeholder="Your Vehicle"
                    />
                  </div>
                  <div className="flex flex-col py-3">
                    <h1 className=" text-xs font-semibold">Plate Number</h1>
                    <input
                      onChange={handleChange}
                      className="p-2 border border-gray-300 shadow-sm rounded-sm"
                      type="text"
                      name="plate_number"
                      placeholder="Plate Number"
                    />
                  </div>
                  <div className=" flex flex-row gap-2 ">
                    <div className="flex flex-col py-3 w-full">
                      <h1 className=" text-xs font-semibold">Preferred Date</h1>
                      <input
                        onChange={handleChange}
                        className="p-2 border border-gray-300 shadow-sm rounded-sm"
                        type="date"
                        name="set_date"
                      />
                    </div>

                    <div className="flex flex-col py-3 w-full">
                      <h1 className=" text-xs font-semibold">Preferred Time</h1>
                      <input
                        onChange={handleChange}
                        className="p-2 border border-gray-300 shadow-sm rounded-sm"
                        type="time"
                        name="set_time"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col py-3">
                <h1 className=" text-xs font-semibold">Inquiry</h1>
                <textarea
                  onChange={handleChange}
                  rows={5}
                  className="p-2 border border-gray-300 shadow-sm rounded-sm"
                  name="inquiry"
                  placeholder="Write your inquiry here..."
                />
              </div>

              <div className=" w-full flex justify-between gap-2">
                <a
                  onClick={handleCloseNewInquiry}
                  className=" cursor-pointer py-2 w-full text-center text-gray-900 border border-gray-900 rounded-sm font-semibold shadow-sm hover:bg-gray-900 hover:text-white duration-100"
                >
                  Close
                </a>
                <button
                  className=" cursor-pointer py-2 w-full rounded-sm bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700 duration-100"
                  type="submit"
                >
                  {addNewLoading ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : (
                    "Add"
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

export default Inquiries;
