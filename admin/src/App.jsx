import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';

const App = () => {
  const {aToken} = useContext(AdminContext)

  return aToken? (
    // Jika sudah login (ada token)
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <NavBar/>
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
