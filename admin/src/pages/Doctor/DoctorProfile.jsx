import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from "../../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {

  const {dToken,profileData,setProfileData, getProfileData,backendUrl} =  useContext(DoctorContext)
  const {currency} = useContext(AppContext)

  const[isEdit, setIsEdit] = useState(false)

  const updateProfile = async ()=>{
    try {

      const  updateData = {
        address:  profileData.address,
        fee: profileData.fee,
        available: profileData.available,
      }

      const {data} =  await axios.post(backendUrl+'/api/doctor/update-profile', updateData,{headers:{dToken}})
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error);
    }
  }

  useEffect(()=>{
    if (dToken) {
      getProfileData()
    }

  },[dToken])

  return profileData && (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0">
          <img 
            src={profileData.image} 
            alt="" 
            className="w-48 h-48 rounded-lg object-cover border-2 border-gray-200 shadow-md"
          />
        </div>

        <div className="flex-1 space-y-6">
         {/* doc info: name,degree, experience */}
         <p className="text-3xl font-bold text-gray-800 mb-2">{profileData.name}</p>
         <div className="space-y-3">
          <p className="text-lg text-gray-600 font-medium">{profileData.degree} - {profileData.speciality}</p>
          <button className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors">
            {profileData.experience}
          </button>
         </div>

         {/* doc about */}
         <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <p className="text-lg font-semibold text-gray-800 mb-3">About:</p>
          <p className="text-gray-600 leading-relaxed">
             {profileData.about}
          </p>
         </div>
         
         <p className="text-lg">
          <span className="font-semibold text-gray-700">Appointment fee:</span> 
          <span className="text-2xl font-bold text-green-600 ml-2">{currency} {isEdit? <input type="number" onChange={(e)=>setProfileData(prev => ({...prev, fee: e.target.value}))} value={profileData.fee} /> : profileData.fee}</span>
         </p>

         <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          <p className="text-lg font-semibold text-gray-800 mb-3">Address:</p>
          <p className="text-gray-600">{ isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line1:e.target.value}}))} value={profileData.address.line1}/>: profileData.address.line1}</p>
          <br />
          <p className="text-gray-600">{ isEdit ? <input type="text" onChange={(e)=>setProfileData(prev => ({...prev,address:{...prev.address,line2:e.target.value}}))} value={profileData.address.line2}/>: profileData.address.line2}</p>
         </div>

         <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <input onChange={()=> isEdit && setProfileData(prev =>({...prev, available: !prev.available}))}checked={profileData.available}
            type="checkbox" 
            name="" 
            id="available" 
            className="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
          <label 
            htmlFor="available"
            className="text-lg font-medium text-gray-700 cursor-pointer"
          >
            Available
          </label>
         </div>

         {
          isEdit
          ?
           <button onClick={updateProfile} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
           Save
         </button>
         :
          <button onClick={()=>setIsEdit(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
           Edit
         </button>
         }
        </div>
        
      </div>
    </div>
  )
}

export default DoctorProfile