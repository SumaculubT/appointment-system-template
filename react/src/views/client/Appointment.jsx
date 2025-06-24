import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

const Appointment = () => {
  const { user, setUser } = useStateContext();

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

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
      setInquiry((prev) => ({
        ...prev,
        user_id: data.id,
        user_name: data.name,
        user_email: data.email,
        user_contact_number: data.contact_number,
      }));
    });
  }, []);

  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient
      .post("/inquiry", inquiry)
      .then(() => {
        alert("Inquiry submitted successfully!");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit inquiry");
      });
  };

  const handleChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  return (
    <section className="text-gray-900 py-30">
      <div className="w-3/4 bg-white m-auto p-10 shadow-md">
        <form onSubmit={onSubmit} className="flex flex-col">
          <h1 className="text-2xl font-semibold bg-red-700 text-white p-2 mb-10">
            Inquire/Book
          </h1>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="user_name">
              Name
            </label>
            <input
              value={inquiry.user_name}
              className="p-2 border border-gray-300 shadow-sm"
              type="text"
              name="user_name"
              placeholder="Name"
              onChange={handleChange}
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
              className="p-2 border border-gray-300 shadow-sm"
              type="text"
              name="user_contact_number"
              placeholder="Contact Number"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="vehicle_desc">
              Vehicle Year, Make and Model
            </label>
            <input
              className="p-2 border border-gray-300 shadow-sm"
              type="text"
              name="vehicle_desc"
              placeholder="Your Vehicle"
              value={inquiry.vehicle_desc}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="plate_number">
              Plate Number
            </label>
            <input
              className="p-2 border border-gray-300 shadow-sm"
              type="text"
              name="plate_number"
              placeholder="Plate Number"
              value={inquiry.plate_number}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="set_date">
              Preferred Date
            </label>
            <input
              className="p-2 border border-gray-300 shadow-sm"
              type="date"
              name="set_date"
              value={inquiry.set_date}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="set_time">
              Preferred Time
            </label>
            <input
              className="p-2 border border-gray-300 shadow-sm"
              type="time"
              name="set_time"
              value={inquiry.set_time}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col py-3">
            <label className="text-md font-semibold" htmlFor="inquiry">
              Inquiry
            </label>
            <textarea
              rows={5}
              className="p-2 border border-gray-300 shadow-sm"
              name="inquiry"
              placeholder="Write your inquiry here..."
              value={inquiry.inquiry}
              onChange={handleChange}
            />
          </div>

          <button
            className="py-2 px-10 w-fit bg-green-600 font-semibold text-white shadow-sm"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Appointment;
