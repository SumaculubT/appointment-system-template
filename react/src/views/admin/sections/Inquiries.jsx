import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../axios-client";
import dayjs from "dayjs";
import { FaCheck, FaTimes, FaUserLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { TbHandStop } from "react-icons/tb";

const Inquiries = () => {
  const { inquiries, fetchInquiries } = useStateContext();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [waitListLoading, setWaitListLoading] = useState(false);

  const { notification, setNotification } = useStateContext();

  const [inquiry, setInquiry] = useState({
    status: "",
    plate_number: "",
    vehicle_desc: "",
    set_date: "",
    set_time: "",
  });

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
  useEffect(() => {
    getInquiries();
  }, []);

  const viewDetailsRef = useRef(null);
  const viewDetailsBgRef = useRef(null);

  const getInquiries = () => {
    axiosClient
      .get("/inquiry")
      .then(({ data }) => {
        fetchInquiries(data.data);
      })
      .catch((err) => {
        console.error("Failed to load inquiries:", err);
      });
  };

  const viewDetailsBtn = (inq) => {
    setSelectedInquiry(inq);
    setInquiry({
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

  const handleInquiryUpdate = async (
    ev,
    status = null,
    setLoading = null,
    successMessage = "Successfully saved."
  ) => {
    ev.preventDefault();
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
      setIsVisible(true);
      getInquiries();
      navigate("/dashboard/inquiries");
    } catch (err) {
      if (setLoading) setLoading(false);
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  const saveDetails = (ev) => handleInquiryUpdate(ev);
  const approve = (ev) =>
    handleInquiryUpdate(ev, "approved", setApproveLoading);
  const waitlist = (ev) =>
    handleInquiryUpdate(ev, "waitlisted", setWaitListLoading);
  const reject = (ev) => handleInquiryUpdate(ev, "rejected", setRejectLoading);

  const onDelete = (inq) => {
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

  return (
    <div className="w-11/12 m-auto grid grid-cols-3 gap-5">
      {notification && (
        <div
          className={`fixed bottom-15 -right-4 z-50 bg-green-500 font-semibold text-xl -skew-x-12 text-white px-20 py-8 shadow-lg ${animationClass}`}
        >
          {notification}
        </div>
      )}
      {inquiries.map((inq) => (
        <div
          key={inq.id}
          className="flex flex-col text-md bg-white rounded-md shadow-md py-5 px-10"
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

          <div className="flex justify-between border-b border-gray-300 pb-4 font-semibold text-gray-900">
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
              className=" flex flex-row text-red-500 bg-red-50 border border-red-500 gap-2 justify-center shadow-sm hover:scale-105 duration-300 py-2 rounded-sm w-1/3"
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
              className="absolute scale-0 pb-10 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white shadow-md rounded-md h-fit w-1/4 z-50 duration-200"
            >
              <div className=" flex justify-end h-fit w-full">
                <FaTimes
                  onClick={handleClose}
                  className=" cursor-pointer text-xl m-2"
                />
              </div>
              <form
                onSubmit={saveDetails}
                className=" h-full flex px-10 flex-col text-gray-900"
              >
                <h1 className=" text-center font-bold text-4xl mb-5">
                  Inquiry Details
                </h1>
                <div className="flex justify-between border-b border-gray-300 pb-4 font-semibold text-gray-900">
                  <div className=" flex flex-col gap-4">
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
                      <span className=" text-xs text-gray-600 mr-2">Email</span>
                      <span>{selectedInquiry.user_email}</span>
                    </div>
                    <div>
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

                  <div className=" flex flex-col gap-4">
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
                        className="border border-gray-300 shadow-sm rounded-sm px-2"
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
                    <div className=" flex flex-col gap-2">
                      <span className=" text-xs text-gray-600 mr-2">
                        Preferred Schedule
                      </span>
                      <input
                        className="border border-gray-300 shadow-sm rounded-sm px-2"
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
                        className="border border-gray-300 shadow-sm rounded-sm px-2"
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
                  <span className=" text-xs text-gray-600 mr-2">Inquiry:</span>
                  <span>{selectedInquiry.inquiry}</span>
                </div>
                <button className=" flex flex-row text-blue-500 bg-blue-50 border border-blue-500 gap-2 justify-center shadow-sm hover:scale-105 duration-300 py-2 rounded-sm">
                  Save
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
    </div>
  );
};

export default Inquiries;

{
  /* {errors && (
                  <div className=" w-full p-4 rounded-md shadow-md bg-red-500 text-white text-sm">
                    {Object.keys(errors).map((key) => (
                      <p key={key}>{errors[key][0]}</p>
                    ))}
                  </div>
                )} */
}
