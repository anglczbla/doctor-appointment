import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import axios from 'axios';
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const[email,setEmail] = useState('')
  const[password,setPassword] = useState('')
  const {setAToken, backendUrl} = useContext(AdminContext)

  const onSubmitHandler = async (event) =>{
    event.preventDefault()

    try {
        if (state === 'Admin') {
            const{data} = await axios.post(backendUrl + '/api/admin/login',{email,password})
            if (data.success) {
              localStorage.setItem('aToken',data.token)
                setAToken(data.token);
            }else{
              toast.error(data.message)

            }
        }else{
          

        }
        
    } catch (error) {
        
    }

  }




  
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border-2 rounded-xl text-[#5E5E5E] text-base shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-[#5F6FFF]">{state}</span> Login
        </p>
        
        <div className="w-full">
          <p className="text-base font-medium">Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
            className='border-2 border-[#DADADA] rounded w-full p-3 mt-1 text-base'
            type="email" 
            required 
          />
        </div>
        
        <div className="w-full">
          <p className="text-base font-medium">Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
            className='border-2 border-[#DADADA] rounded w-full p-3 mt-1 text-base' 
            type="password" 
            required 
          />
        </div>
        
        <button className="bg-[#5F6FFF] text-white w-full py-3 rounded-md text-lg font-medium">
          Login
        </button>
        
        {state === 'Admin'
          ? <p className="text-base">Doctor Login? <span onClick={() => setState('Doctor')} className="text-[#5F6FFF] cursor-pointer underline font-medium">Click here</span></p>
          : <p className="text-base">Admin Login? <span onClick={() => setState('Admin')}className="text-[#5F6FFF] cursor-pointer underline font-medium">Click here</span></p>
        }
      </div>
    </form>
  );
};

export default Login;