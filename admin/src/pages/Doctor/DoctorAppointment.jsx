import React from 'react'
import { useContext } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorAppointment = () => {

  const {dToken, appointments, getAppointments} = useContext(DoctorContext)
  const {calculateAge, slotDateFormat, currency} =  useContext(AppContext)

  useEffect(()=>{
    if (dToken) {
      getAppointments()
    }
  },[dToken])
  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border-gray-50 rounded text-sm max-h=[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border border-gray-50'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fee</p>
          <p>Action</p>
        </div>
        {
          appointments.map((item,index)=>(
            <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-gray-50 hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
              </div>

              <div>
                <p className='text-xs inline border  border-blue-500 px-2 rounded-full'>{item.payment ? 'Online':'CASH'}</p>
              </div>
              <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
              <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
              <p>{currency}{item.amount}</p>
              <div className='flex'>
                <img className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                <img className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorAppointment
