import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useState } from 'react'
import {toast} from 'react-toastify'

const AllAppointment = () => {

  const {aToken, appointments, getAllAppointments, cancelAppointment, backendUrl} = useContext(AdminContext)
  const {calculateAge, slotDateFormat} = useContext(AppContext)
  const [pendingPayments, setPendingPayments] = useState([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)

 const getPendingPayments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/get-payments', {
        headers: { aToken }
      })
      if (data.success) {
        setPendingPayments(data.data)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const verifyPayment = async (appointmentId, verify) => {
    try {
      setIsVerifying(true)
      const { data } = await axios.post(
        backendUrl + '/api/admin/verify-payments',
        { appointmentId, verify },
        { headers: { aToken } }
      )
      
      if (data.success) {
        toast.success(data.message)
        getPendingPayments()
        getAllAppointments()
        setShowPaymentModal(false)
        setSelectedPayment(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setIsVerifying(false)
    }
  }

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPayment(null)
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
      getPendingPayments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-medium">All Appointments</p>
        {pendingPayments.length > 0 && (
          <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
            {pendingPayments.length} Payment(s) Pending Verification
          </div>
        )}
      </div>
      
      {/* Pending Payments Section */}
      {pendingPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
          <h3 className="text-md font-medium text-yellow-800 mb-3">Payments Pending Verification</h3>
          <div className="space-y-2">
            {pendingPayments.map((payment, index) => (
              <div key={payment._id} className="bg-white p-3 rounded border flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-medium">{payment.patientName}</p>
                  <p className="text-sm text-gray-600">{payment.doctorName}</p>
                  <p className="text-sm text-gray-600">{payment.appointmentDate} | {payment.appointmentTime}</p>
                  <p className="text-sm font-medium text-green-600">${payment.amount}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openPaymentModal(payment)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    View & Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Header */}
        <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_2fr_2fr_1fr] py-3 px-6 border-b border-gray-100 bg-gray-50 text-sm font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Dynamic appointments data when available */}
        {appointments && appointments.map((item, index) => (
          <div className="grid grid-cols-[0.5fr_2fr_2fr_1fr_2fr_2fr_1fr] items-center text-gray-600 py-4 px-6 border-b border-gray-100 hover:bg-gray-50" key={index}>
            <p>{index + 1}</p>
            
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={item.userData?.image || '/api/placeholder/32/32'} alt="" />
              <p>{item.userData?.name || 'Patient Name'}</p>
            </div>
            
            <p>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 rounded-full" src={item.docData?.image || '/api/placeholder/32/32'} alt="" />
              <p>{item.docData?.name || 'Dr. Name'}</p>
            </div>
            
            <div className="flex flex-col">
              <p>${item.amount || 0}</p>
              {item.payment && !item.isCompleted && (
                <span className="text-xs text-orange-500">Pending Verification</span>
              )}
              {item.payment && item.paymentProof && (
                <span className="text-xs text-blue-500">With Proof</span>
              )}
            </div>
            
            {item.cancelled 
            ?
            <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            : item.isCompleted 
            ?<p className='text-green-400 text-xs font-medium'>Completed</p> 
            : item.payment && !item.isCompleted
            ? <p className='text-orange-400 text-xs font-medium'>Payment Submitted</p>
            :<img onClick={()=>cancelAppointment(item._id)}className='w-10 cursor-pointer'src={assets.cancel_icon} alt="" />
          }
          </div>
        ))}

        {/* If no appointments and no sample data */}
        {(!appointments || appointments.length === 0) && (
          <div className="py-10 text-center text-gray-500">
            <p>Loading appointments...</p>
          </div>
        )}
      </div>

      {/* Payment Verification Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Verification</h3>
              <button 
                onClick={closePaymentModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Payment Details */}
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">Appointment Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Patient:</span> {selectedPayment.patientName}</p>
                  <p><span className="font-medium">Doctor:</span> {selectedPayment.doctorName}</p>
                  <p><span className="font-medium">Date & Time:</span> {selectedPayment.appointmentDate} | {selectedPayment.appointmentTime}</p>
                  <p><span className="font-medium">Amount:</span> <span className="text-green-600 font-semibold">${selectedPayment.amount}</span></p>
                  <p><span className="font-medium">Submitted:</span> {new Date(selectedPayment.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Payment Proof */}
              {selectedPayment.paymentProof ? (
                <div>
                  <h4 className="font-medium mb-2">Payment Proof</h4>
                  <div className="border rounded p-2">
                    <img 
                      src={`${selectedPayment.paymentProof}`}
                      alt="Payment Proof"
                      className="w-full max-w-md mx-auto rounded"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                    {console.log(`${selectedPayment.paymentProof}`)
                    }
                    
                    <div className="text-center text-gray-500 py-4" style={{display: 'none'}}>
                      Payment proof image not available
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-yellow-700 text-sm">No payment proof uploaded by patient</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => verifyPayment(selectedPayment._id, false)}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Processing...' : 'Reject Payment'}
                </button>
                <button
                  onClick={() => verifyPayment(selectedPayment._id, true)}
                  disabled={isVerifying}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Processing...' : 'Approve & Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllAppointment