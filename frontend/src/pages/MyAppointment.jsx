import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useState , useEffect} from "react";
import axios from 'axios'
import { toast } from "react-toastify";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData} = useContext(AppContext);

  const [appointments, setAppointments] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [paymentProof, setPaymentProof] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const openPaymentModal = (appointment) => {
    setSelectedAppointment(appointment)
    setShowPaymentModal(true)
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedAppointment(null)
    setPaymentProof(null)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validasi file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP)')
        return
      }
      
      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      
      setPaymentProof(file)
    }
  }

  const submitPayment = async () => {
    if (!selectedAppointment) return
    
    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('appointmentId', selectedAppointment._id)
      
      if (paymentProof) {
        formData.append('paymentProof', paymentProof)
      }

      const {data} = await axios.post(
        backendUrl + '/api/user/payment', 
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        closePaymentModal()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsSubmitting(false)
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
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
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
              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Amount: </span>
                ${item.amount}
              </p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {/* Tombol Pay Online - tampil jika belum cancelled, belum dibayar, dan belum completed */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button 
                  onClick={() => openPaymentModal(item)}
                  className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-green-600 hover:text-white transition-all duration-300'
                >
                  Pay Online
                </button>
              )}
              
              {/* Tombol Cancel - tampil jika belum cancelled, belum dibayar, dan belum completed */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button 
                  onClick={() => cancelAppointment(item._id)} 
                  className='text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300'
                >
                  Cancel Appointment
                </button>
              )}
              
              {/* Status jika sudah bayar tapi belum completed */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className='text-sm text-blue-500 sm:min-w-48 py-2 border border-blue-500 rounded cursor-default'>
                  Payment Submitted
                </button>
              )}
              
              {/* Status jika cancelled */}
              {item.cancelled && !item.isCompleted && (
                <button className="text-sm sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-default">
                  Appointment Cancelled
                </button>
              )}
              
              {/* Status jika completed */}
              {item.isCompleted && (
                <button className="text-sm sm:min-w-48 py-2 border border-green-500 rounded text-green-500 cursor-default">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Confirmation</h3>
              <button 
                onClick={closePaymentModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {selectedAppointment && (
              <div className="mb-4">
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="font-medium">{selectedAppointment.docData.name}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.docData.speciality}</p>
                  <p className="text-sm text-gray-600">
                    {slotDateFormat(selectedAppointment.slotDate)} | {selectedAppointment.slotTime}
                  </p>
                  <p className="text-sm font-medium text-green-600">Amount: ${selectedAppointment.amount}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Payment Proof (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, WebP (Max 5MB)
                  </p>
                </div>

                {paymentProof && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Selected file: {paymentProof.name}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={closePaymentModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitPayment}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointment;