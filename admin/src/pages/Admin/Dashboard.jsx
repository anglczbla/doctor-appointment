import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p>Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p>Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p>Patients</p>
            </div>
          </div>
        </div>

        {/* ✅ Latest Booking Section*/}
        <div className="bg-white mt-10 rounded border-b border-gray-100">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
            <img className="w-5" src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>
          
          <div className="pt-4 pb-4">
            {dashData.latestAppointment && dashData.latestAppointment.length > 0 ? (
              dashData.latestAppointment.map((item, index) => (
                <div key={index} className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50">
                  <img className="w-10 h-10 rounded-full object-cover" src={item.docData.image} alt="" />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">{item.docData.name}</p>
                    <p className="text-gray-500">{item.slotDate}</p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">Cancelled</p>
                  ) : item.isCompleted ? (
                    <p className="text-green-400 text-xs font-medium">Completed</p>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer hover:scale-110 transition-transform"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No recent appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;