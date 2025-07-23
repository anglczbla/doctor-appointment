// api for adding doctor
import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

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

export {addDoctor, loginAdmin, allDoctor, appointmentsAdmin}