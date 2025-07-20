import { useContext, useState } from 'react'
import React from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fee, setFee] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const{backendUrl, aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault() // not reload webpage
    try {
      if (!docImg) {
        return toast.error('Image Not Selected')
      }
      const formData = new FormData()

      formData.append ('image',docImg)
      formData.append ('name',name)
      formData.append ('email',email)
      formData.append ('password',password)
      formData.append ('experience',experience)
      formData.append ('fee',Number(fee))
      formData.append ('about',about)
      formData.append ('speciality',speciality)
      formData.append ('address', JSON.stringify({line1:address1, line2:address2}))
      formData.append ('degree',degree)

      formData.forEach((value,key) => {
        console.log(`${key}: ${value}`);
        
      })

      const { data } = await axios.post(backendUrl + 'api/admin/add-doctor',formData, {headers: {aToken}})
      if (data.success) {
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
    }
  }
 
  return (
    <form onSubmit={onSubmitHandler}  className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium text-gray-700'>Add Doctor</p>
      
      <div className='bg-white px-8 py-8 border border-gray-200 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img" className='cursor-pointer'>
             <img 
              className='w-16 bg-gray-100 rounded-full cursor-pointer' 
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
              alt="" 
            />
          </label>
          <input onChange ={(e) => setDocImg(e.target.files[0])}type="file" id="doc-img" hidden />
          <p className='text-sm text-gray-600'>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Doctor Name</p>
              <input onChange={(e) => setName(e.target.value)} value ={name}
                type="text" 
                placeholder='Name' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Doctor Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value ={email}
                type="email" 
                placeholder='Email' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Doctor Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value ={password}
                type="password" 
                placeholder='Password' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value ={experience}
                name="" 
                id=""
                className='border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>          
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Fee</p>
              <input onChange={(e) => setFee(e.target.value)} value ={fee}
                type="number" 
                placeholder='fee' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value ={speciality}
                name="" 
                id=""
                className='border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Degree</p>
              <input onChange={(e) => setDegree(e.target.value)} value ={degree}
                type="text" 
                placeholder='Degree' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium text-gray-700'>Address</p>
              <input onChange={(e) => setAddress1(e.target.value)} value ={address1}
                type="text" 
                placeholder='address 1' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
              <input onChange={(e) => setAddress2(e.target.value)} value ={address2}
                type="text" 
                placeholder='address 2' 
                required 
                className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

          </div>
        </div>

        <div className='mt-6 w-full'>
          <p className='text-sm font-medium text-gray-700 mb-2'>About Doctor</p>
          <textarea onChange={(e) => setAbout(e.target.value)} value ={about}
            placeholder='write about yourself' 
            rows={5} 
            required 
            className='w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <button 
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full mt-6 transition-colors duration-200 font-medium'
        >
          Add doctor
        </button>

      </div>
    </form>
  )
}

export default AddDoctor