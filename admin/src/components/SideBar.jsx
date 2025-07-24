import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const SideBar = () => {

const {aToken} = useContext(AdminContext)
const {dToken} = useContext(DoctorContext)
  return (
    <div className='min-h-screen bg-white border-r border-gray-200 w-64 flex flex-col'>
        { aToken && <ul className='flex flex-col py-6'>

            <NavLink 
                to ={'/admin-dashboard'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.home_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>Dashboard</p>
            </NavLink>
            
            <NavLink 
                to ={'/all-appointment'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.appointment_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>All Appointment</p>
            </NavLink>
            
            <NavLink 
                to ={'/add-doctor'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.add_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>Add Doctor</p>
            </NavLink>
            
            <NavLink 
                to ={'/doctor-list'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.people_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>Doctor List</p>
            </NavLink>

            </ul>
            }
            { dToken && <ul className='flex flex-col py-6'>

            <NavLink 
                to ={'/doctor-dashboard'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.home_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>Dashboard</p>
            </NavLink>
            
            <NavLink 
                to ={'/doctor-appointments'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.appointment_icon} alt="" className='w-5 h-5' />
                <p className='font-medium'>All Appointment</p>
            </NavLink>
            
            <NavLink 
                to ={'/doctor-profile'}
                className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 mx-4 rounded-lg transition-all duration-200 ${
                        isActive 
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`
                }
            >
                <img src={assets.people_icon} alt="" className='w-5 h-5' />
                <p>Profile</p>
            </NavLink>
            </ul>
            }
      
    </div>
  )
}

export default SideBar