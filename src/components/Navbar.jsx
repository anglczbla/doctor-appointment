import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)
    const [token, setToken] = useState(true)

    return (
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
            <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
            <ul className='hidden md:flex items-start gap-5 font-medium'>
                <NavLink to='/' className={({ isActive }) => `py-1 ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'hover:text-blue-500'}`}>
                    <li>Home</li>
                </NavLink>
                <NavLink to='/doctor' className={({ isActive }) => `py-1 ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'hover:text-blue-500'}`}>
                    <li>All Doctor</li>
                </NavLink>
                <NavLink to='/about' className={({ isActive }) => `py-1 ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'hover:text-blue-500'}`}>
                    <li>About</li>
                </NavLink>
                <NavLink to='/contact' className={({ isActive }) => `py-1 ${isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'hover:text-blue-500'}`}>
                    <li>Contact</li>
                </NavLink>
            </ul>
            <div className='flex items-center gap-4'>
                {
                    token ?
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 rounded-full' src={assets.profile_pic} alt="" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                    <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                    <p onClick={() => navigate('my-appointment')} className='hover:text-black cursor-pointer'>My Appointment</p>
                                    <p onClick={() => setToken(false)} className='hover:text-black cursor-pointer'>Logout</p>
                                </div>
                            </div>
                        </div>
                        :
                        <button onClick={() => navigate('/login')} className='bg-blue-400 text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
                }
            </div>
        </div>
    );
};

export default Navbar;