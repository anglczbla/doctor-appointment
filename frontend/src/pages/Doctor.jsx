import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  const navigate = useNavigate()
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-blue-600 text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctor') : navigate('/doctor/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "General physician" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctor') : navigate('/doctor/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Gynecologist" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctor') : navigate('/doctor/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Dermatologist" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctor') : navigate('/doctor/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Pediatricians" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctor') : navigate('/doctor/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Neurologist" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctor') : navigate('/doctor/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-2.5 pr-16 border border-gray-300 rounded-lg transition-all cursor-pointer hover:bg-gray-50 ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-indigo-700 border-indigo-200 font-medium" : "text-gray-700"}`}>Gastroenterologist</p>
        </div>
        
        <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
          {
            filterDoc.map((item, index) => (
              <div onClick={() => navigate(`/appointment/${item._id}`)} className='bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200' key={index}>
                {/* Doctor Image */}
                <div className='bg-blue-50'>
                  <img className='w-full h-60 object-cover' src={item.image} alt={item.name} />
                </div>
                
                {/* Card Content */}
                <div className='p-4'>
                  {/* Available Status */}

                  <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}  mb-2`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p>
                    <p>{item.available? 'Available' :'Not Available'}</p>
                  </div>
                  
                  {/* Doctor Name */}
                  <p className='text-gray-900 font-semibold text-lg mb-1 leading-tight'>{item.name}</p>
                  
                  {/* Speciality */}
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctor