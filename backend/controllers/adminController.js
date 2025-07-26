// api for adding doctor
import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

const addDoctor =  async (req,res) =>{

    try {
        const {name, email, password, speciality, degree, experience, about, fee, address} = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email ||!password || !speciality || !degree || !experience|| !about || !fee ||!address){
            return res.json({success:false,message:"Missing Details"})
        }
        // validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter an valid email"})
        }

        //validating password
       if(password.length < 8){
    return res.json({success:false, message:"Please enter strong password"})
}

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to  cloudinary

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData ={
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address:JSON.parse(address),
            date:Date.now()
        }   

        const newDoctor = doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor added success"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// API for admin login
const loginAdmin = async (req,res) =>{
    try {
        const{email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})


        }else{
            res.json({success:false, message:"invalid credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

// api to get all doctor list for admin

const allDoctor = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({}).select('-password') // exclude password
        res.json({success:true, doctors})
        

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

// api to get all appointment list
const appointmentsAdmin =  async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// api to cancel appointment
const appointmentCancel = async (req,res)=>{
  try {
    const {appointmentId} = req.body
    const appointmentData =  await appointmentModel.findById(appointmentId)


    await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

    // releasing doctor slot
    const {docId, slotDate, slotTime} = appointmentData
    const doctorData = await doctorModel.findById(docId)

    let slots_booked = doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!== slotTime)
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.json({success:true,message:'Appointment cancelled'})

  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
}

// api to get dashboard data for admin panel
const adminDashboard = async (req,res) =>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointment: appointments.reverse().slice(0,5)
        }

        res.json({success:true,dashData})
        
    } catch (error) {
        console.log("Update profile error:", error);
        res.json({ success: false, message: error.message });
        
    }
}

// API untuk verify payment (Admin only)
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, verify } = req.body // verify: true/false

    // Cari appointment
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" })
    }

    if (verify) {
      // Jika di-approve, complete appointment
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        isCompleted: true
      })
      
      res.json({
        success: true,
        message: "Payment verified and appointment completed"
      })
      
    } else {
      // Jika di-reject, set payment ke false
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: false,
        isCompleted: false
      })
      
      res.json({
        success: true,
        message: "Payment rejected"
      })
    }

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API untuk lihat daftar payment yang perlu diverifikasi (Admin)
const getPendingPayments = async (req, res) => {
  try {
    // Cari appointment yang payment=true tapi isCompleted=false
    const pendingPayments = await appointmentModel.find({
      payment: true,
      isCompleted: false,
      cancelled: false
    }).sort({ date: -1 }) // Urutkan berdasarkan tanggal terbaru

    const formattedPayments = pendingPayments.map(appointment => ({
      _id: appointment._id,
      patientName: appointment.userData.name,
      doctorName: appointment.docData.name,
      appointmentDate: appointment.slotDate,
      appointmentTime: appointment.slotTime,
      amount: appointment.amount,
      paymentProof: appointment.paymentProof, // File proof jika ada
      submittedAt: appointment.updatedAt
    }))

    res.json({
      success: true,
      data: formattedPayments
    })

  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {addDoctor, loginAdmin, allDoctor, appointmentsAdmin, appointmentCancel, adminDashboard, verifyPayment, getPendingPayments}