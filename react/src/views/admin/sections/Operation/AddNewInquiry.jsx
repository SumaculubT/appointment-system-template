import React from "react";

const AddNewInquiry = () => {
  const addNewRef = useRef(null);

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
      <div
        ref={addNewBgRef}
        className="fixed scale-0 inset-0 bg-[rgba(16,24,33,0.3)] z-40 backdrop-blur-sm"
      ></div>
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
                <label className="text-md font-semibold" htmlFor="user_name">
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
                <label className="text-md font-semibold" htmlFor="vehicle_desc">
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
                <label className="text-md font-semibold" htmlFor="plate_number">
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
                  <label className="text-md font-semibold" htmlFor="set_date">
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
                  <label className="text-md font-semibold" htmlFor="set_time">
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
    </>
  );
};

export default AddNewInquiry;
