import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorList from './pages/Admin/DoctorList';
import Dashboard from './pages/Admin/Dashboard';

const App = () => {
  const {aToken} = useContext(AdminContext)

  return aToken? (
    // Jika sudah login (ada token)
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <NavBar/>
      <div className='flex items-start'>
      <SideBar/>
      <Routes>
      <Route path='/' element={<></>}/>
      <Route path='/admin-dashboard' element={<Dashboard/>}/>
      <Route path='/all-appointment' element={<AllAppointment/>}/>
      <Route path='/add-doctor' element={<AddDoctor/>}/>
      <Route path='/doctor-list' element={<DoctorList/>}/>
      </Routes>
      </div>
    </div>
  ):(
      // Jika belum login (tidak ada token)
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
