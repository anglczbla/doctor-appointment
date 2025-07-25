import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData, completeAppointment, cancelAppointment} =
    useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}
              </p>
              <p>Earnings</p>
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
            {dashData.latestAppointments &&
            dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50"
                >
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={item.userData.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-800 font-medium">
                      {item.userData.name}
                    </p>
                    <p className="text-gray-500">
                      {" "}
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium">
                      Completed
                    </p>
                  ) : (
                    <div className="flex">
                      <img
                        className="w-10 cursor-pointer"
                        src={assets.cancel_icon}
                        alt=""
                        onClick={() => cancelAppointment(item._id)}
                      />
                      <img
                        className="w-10 cursor-pointer"
                        src={assets.tick_icon}
                        alt=""
                        onClick={() => completeAppointment(item._id)}
                      />
                    </div>
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

export default DoctorDashboard;
