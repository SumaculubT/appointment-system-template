import React, { useEffect } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../axios-client";

const Inquiries = () => {
  const { inquiries, fetchInquiries } = useStateContext();

  useEffect(() => {
    axiosClient
      .get("/inquiry")
      .then(({ data }) => {
        fetchInquiries(data.data);
      })
      .catch((err) => {
        console.error("Failed to load inquiries:", err);
      });
  }, []);

  return (
    <div className="w-11/12 m-auto grid grid-cols-4 gap-5">
      {inquiries.length === 0 && <p>No inquiries yet.</p>}
      {inquiries.map((inq) => (
        <div
          key={inq.id}
          className="flex flex-col text-sm bg-white rounded-md shadow-md p-4 text-gray-900"
        >
          <div className=" flex flex-row mb-4">
            <span
              className={`w-fit py-1 px-5 rounded-full text-white ${
                inq.status === "pending"
                  ? "bg-yellow-500"
                  : inq.status === "approved"
                  ? "bg-green-500"
                  : inq.status === "rejected"
                  ? "bg-red-600"
                  : "bg-gray-400"
              }`}
            >
              {inq.status}
            </span>

            <span className=" w-full flex justify-end text-sm text-gray-500">
              {inq.created_at}
            </span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">From:</span>
            <span>{inq.user_name}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">Email:</span>
            <span>{inq.user_email}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Contact Number:
            </span>
            <span>{inq.user_contact_number}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Vehicle Description:
            </span>
            <span>{inq.vehicle_desc}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Plate Number:
            </span>
            <span>{inq.plate_number}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Plate Number:
            </span>
            <span>{inq.plate_number}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Preferred Date:
            </span>
            <span>{inq.set_date}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">
              Preferred Time:
            </span>
            <span>{inq.set_time}</span>
          </div>
          <div className=" flex flex-row">
            <span className=" font-semibold text-gray-800 mr-2">Inquiry:</span>
            <span>{inq.inquiry}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inquiries;
