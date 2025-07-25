import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState , useEffect} from "react";
import axios from 'axios'
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData} = useContext(AppContext);

  const [appointments, setAppointments] = useState([])
  const months = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return "Date not available";
    
    const dateArray = slotDate.split('_')
    if (dateArray.length !== 3) return "Invalid date";
    
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () =>{
    try {
      const {data} = await axios.get(backendUrl + '/api/user/appointments',{headers:{token}})
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) =>{

    try {
      const {data} = await axios.post (backendUrl + '/api/user/cancel-appointment', {appointmentId}, {headers:{token}})
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }else{
        toast.error(data.message)
      }

      console.log(appointmentId);
      
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
    }

  }

  useEffect (()=>{
    if (token) {
      getUserAppointments()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700'>My Appointment</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2' key={index}>
            <div>
              <img  className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time: </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime || "Time not available"}
              </p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-green-600 hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.payment &&  !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className="text-sm sm:win-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>}
              {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500">Completed</button>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointment;
