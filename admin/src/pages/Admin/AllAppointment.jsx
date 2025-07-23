import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'

const AllAppointment = () => {

  const {aToken, appointments, getAllAppointments} = useContext(AdminContext)

  useEffect (()=>{
    if (aToken) {
      getAllAppointments()
    }
  },[aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Header */}
        <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_2fr_2fr_1fr] py-3 px-6 border-b bg-gray-50 text-sm font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Department</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
        </div>

        {/* Dynamic appointments data when available */}
        {appointments && appointments.map((item, index) => (
          <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_2fr_2fr_1fr] items-center text-gray-600 py-4 px-6 border-b hover:bg-gray-50" key={index}>
            <p>{index + 1}</p>
            
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={item.userData?.image || '/api/placeholder/32/32'} alt="" />
              <p>{item.userData?.name || 'Patient Name'}</p>
            </div>
            
            <p>{item.department || item.userData?.name || 'Department'}</p>
            <p>{item.userData?.age || 'N/A'}</p>
            <p>{item.slotDate}, {item.slotTime}</p>
            
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={item.docData?.image || '/api/placeholder/32/32'} alt="" />
              <p>{item.docData?.name || 'Dr. Name'}</p>
            </div>
            
            <p>${item.amount || 0}</p>
          </div>
        ))}

        {/* If no appointments and no sample data */}
        {(!appointments || appointments.length === 0) && (
          <div className="py-10 text-center text-gray-500">
            <p>Loading appointments...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllAppointment