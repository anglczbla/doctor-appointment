import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailability =async (req,res) =>{
    try {
        
    const {docId} = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
    res.json({success:true, message:'Availablity Changed'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }

}

const doctorList =  async(req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email']) //exclude email n password
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}


// api for doctor login
const loginDoctor = async (req,res) =>{

    try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if (!doctor) {
            return res.json({success:false,message:'invalid credentials'}) 
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false, message:'invalid login for doctor'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

// api to get doctor appointment for doctor panel

const appointmentsDoctor = async (req,res) =>{ 
    try {
        const docId = req.docId;
        const appointments = await appointmentModel.find({ docId })

        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

// api to mark appointment completed for doctor panel
const appointmentComplete = async (req,res)  =>{
    try {

        const docId = req.docId;
        const{appointmentId} = req.body

        const appointmentData =  await appointmentModel.findById(appointmentId)

        if (appointmentId && appointmentData.docId === docId) {
            
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
            return res.json({success:true,message:'Appointment completed'})
        }else{
            return res.json({success:false,message:'Mark Failed'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// api to mark appointment cancel for doctor panel
const appointmentCancel = async (req,res)  =>{
    try {

        const docId = req.docId;
        const{appointmentId} = req.body

        const appointmentData =  await appointmentModel.findById(appointmentId)

        if (appointmentId && appointmentData.docId === docId) {
            
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})
            return res.json({success:true,message:'Appointment cancelled'})
        }else{
            return res.json({success:false,message:'Cancellation failed'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}


export {changeAvailability,doctorList, loginDoctor, appointmentsDoctor, appointmentComplete,  appointmentCancel}