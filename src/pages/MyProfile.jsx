import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Angelica Izabella",
    image: assets.profile_pic,
    email: "angelicaizabella@gmail.com",
    phone: '+62-893-990',
    address: {
      line1: "Palembang",
      line2: "Sumsel",
    },
    gender: "Female",
    dob: "2003-09-17",
  });

  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      <img className='w-36 rounded' src={userData.image} alt="" />
      {isEdit ? (
        <input className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          type="text"
          value ={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p>{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
         {
          isEdit
          ? <p>
            <input 
              className="bg-gray-100 max-w-52"
              type="text" 
              value={userData.address.line1}
              onChange={(e) => setUserData(prev => ({...prev, address:{...prev.address, line1: e.target.value}}))}
            />
            <br />
            <input 
              className="bg-gray-100 max-w-52"
              type="text" 
              value={userData.address.line2}
              onChange={(e) => setUserData(prev => ({...prev, address:{...prev.address, line2: e.target.value}}))}
            />
          </p>
          : <p>
            {userData.address.line1}
            <br />
            {userData.address.line2}
          </p>
         }
        </div>
      </div>
      <div>
        <p className="text-neutral-600 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {
            isEdit
            ?<select className="bg-gray-100 max-w-52" onChange={(e)=> setUserData(prev => ({...prev, gender: e.target.value}))} value ={userData.gender}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            : <p>{userData.gender}</p>
          }
          <p className="font-medium">Birthday:</p>
          {
            isEdit
            ?<input className="bg-gray-100 max-w-52" type="date" onChange={(e)=> setUserData(prev => ({...prev, dob: e.target.value}))} value ={userData.dob}/>
            : <p>{userData.dob}</p>
          }
        </div>
      </div>
      <div className="mt-5">
        {
          isEdit
          ? <button className="border bg-blue-600 py-2 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all" onClick={() => setIsEdit(false)}>Save information</button>
          : <button className="border  bg-blue-600 py-2 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all" onClick={() => setIsEdit(true)}>Edit</button>
        }
      </div>
    </div>
  );
};

export default MyProfile;