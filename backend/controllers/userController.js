import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2  as cloudinary} from'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// api register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api  for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user profile data

const getProfile = async (req,res) => {
  try {
    const userId = req.userId
    const userData = await userModel.findById(userId).select("-password")

    res.json({ success: true, userData })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to update user profile

const updateProfile = async (req, res) => {
  try {

    const userId = req.userId
    
    if (!userId) {
      return res.json({ success: false, message: "User ID not found" })
    }
    
    const { name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    
    // Validasi data required
    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" })
    }
  
    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender
    }
    
   
    const updatedUser = await userModel.findByIdAndUpdate(
      userId, 
      updateData,
      { new: true, runValidators: true } // ✅ Return updated doc & run validation
    )
    
    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" })
    }
  
    if (imageFile) {
      try {
        console.log("Uploading image:", imageFile.path) // ✅ DEBUG LOG
        
        // FIX 5: Fix cloudinary upload with proper resource_type
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image", // 
          folder: "user_profiles",
          transformation: [
            { width: 400, height: 400, crop: "fill" }
          ]
        })
        
        const imageURL = imageUpload.secure_url
        
        // Update image URL
        const imageUpdatedUser = await userModel.findByIdAndUpdate(
          userId,
          { image: imageURL },
          { new: true }
        )

        
      } catch (imageError) {
        return res.json({ 
          success: true, 
          message: "Profile updated but image upload failed",
          error: imageError.message 
        })
      }
    }
    
    // ✅ SUCCESS RESPONSE
    res.json({ 
      success: true, 
      message: "Profile Updated Successfully"
    })
    
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
}

// api to book appointment
const bookAppointment = async(req,res) =>{
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: "Field wajib (userId, docId, slotDate, slotTime) tidak lengkap",
      });
    }
    // Validasi userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "userId tidak valid" });
    }
    const docData =  await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({succes:false,message:"Doctor not available"})
    }

    let slots_booked = docData.slots_booked

    // checking for slot availability
    if (slots_booked[slotDate]) 
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({succes:false,message:"Slot not available"})
      }else{
      slots_booked[slotDate].push(slotTime)
    } else{
      slots_booked[slotDate] =[]
      slots_booked[slotDate].push(slotTime)
    }

    const userData  = await userModel.findById(userId).select('-password')
    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      slotDate,
      docData,
      userData,
      amount:docData.fee,
      slotTime,
      date: Date.now()
    }

    const newAppointment = new appointmentModel (appointmentData)
    await newAppointment.save()

    // save new slot data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({success:true,message:"Appointment Booked"})
  
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
    
  }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment};
