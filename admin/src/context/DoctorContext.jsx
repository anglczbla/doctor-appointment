import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext =  createContext()
const DoctorContextProvider = (props) =>{


    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
    const backendUrl =  import.meta.env.VITE_BACKEND_URL
    const [appointments, setAppointments] = useState([])

    const getAppointments = async () =>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers:{dToken}})
            if (data.success) {
                setAppointments(data.appointments) 
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    // Function untuk complete appointment
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/complete-appointment', 
                { appointmentId },
                { headers: { dToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                getAppointments(); // Refresh data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Complete appointment error:', error);
            toast.error('Failed to complete appointment');
        }
    };

    // Function untuk cancel appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/doctor/cancel-appointment', 
                { appointmentId },
                { headers: { dToken } }
            );
            
            if (data.success) {
                toast.success(data.message);
                getAppointments(); // Refresh data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Cancel appointment error:', error);
            toast.error('Failed to cancel appointment');
        }
    };


    const value={
        dToken,setDToken,backendUrl, appointments,setAppointments,getAppointments,cancelAppointment,completeAppointment

    }
    return (
    <DoctorContext.Provider value ={value}>
        {props.children}
    </DoctorContext.Provider>
    )
}


export default DoctorContextProvider