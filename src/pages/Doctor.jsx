import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctor = () => {
  
  const navigate = useNavigate()
  const{speciality} =  useParams()
  const[filterDoc, setFilterDoc] = useState([])
  const {doctors} =  useContext(AppContext)


  const applyFilter = () => {
    if(speciality){
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else{
      setFilterDoc(doctors)
    }
  }

  useEffect(() =>{
    applyFilter()
  }, [doctors,speciality])
 

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <div className='flex flex-col gap-4 text-sm text-gray-600'>
          <p onClick={() => speciality === 'General physician' ? navigator('/doctor'): navigate('/doctor/General physician')}className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigator('/doctor'): navigate('/doctor/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigator('/doctor'): navigate('/doctor/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigator('/doctor'): navigate('/doctor/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigator('/doctor'): navigate('/doctor/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigator('/doctor'): navigate('/doctor/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-600 rounded transition-all cursor pointer`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {
            filterDoc.map((item,index)=>(
            <div onClick={()=> navigate(`/appointment/${item._id}`)}className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <img className='bg-blue-50 w-full h-60 object-cover' src={item.image} alt="" />
                <div className='p-4'>
                    <div className='flex items-center gap-2 text-sm text-green-500 mb-2'>
                        <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                        <p>Available</p>
                    </div>
                    <p className='text-gray-900 font-medium text-base mb-1'>{item.name}</p>
                    <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
            </div>
        ))}
        </div>
      </div>
      
    </div>
  )
}

export default Doctor
