import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";
import main from "../config/gemini.js";

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

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// api to update user profile

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({ success: false, message: "User ID not found" });
    }

    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    // Validasi data required
    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // ✅ Return updated doc & run validation
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    if (imageFile) {
      try {
        console.log("Uploading image:", imageFile.path); // ✅ DEBUG LOG

        // FIX 5: Fix cloudinary upload with proper resource_type
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image", //
          folder: "user_profiles",
          transformation: [{ width: 400, height: 400, crop: "fill" }],
        });

        const imageURL = imageUpload.secure_url;

        // Update image URL
        const imageUpdatedUser = await userModel.findByIdAndUpdate(
          userId,
          { image: imageURL },
          { new: true }
        );
      } catch (imageError) {
        return res.json({
          success: true,
          message: "Profile updated but image upload failed",
          error: imageError.message,
        });
      }
    }

    // ✅ SUCCESS RESPONSE
    res.json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// api to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    if (!userId || !docId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message:
          "Field wajib (userId, docId, slotDate, slotTime) tidak lengkap",
      });
    }
    // Validasi userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "userId tidak valid" });
    }
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate])
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      slotDate,
      docData,
      userData,
      amount: docData.fee,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slot data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// api to get user appointment
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// api to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.log("Update profile error:", error);
    res.json({ success: false, message: error.message });
  }
};

// API untuk user bayar dengan upload proof
const paymentUser = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.userId;

    // Get uploaded file from multer middleware
    const imageFile = req.file;

    // Cari appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    // Cek apakah appointment milik user ini
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Cek apakah sudah dibayar
    if (appointmentData.payment) {
      return res.json({ success: false, message: "Payment already submitted" });
    }

    let paymentProofURL = null;

    // Upload payment proof jika ada file
    if (imageFile) {
      try {
        console.log("Uploading payment proof:", imageFile.path);

        // Upload ke cloudinary dengan folder yang sesuai
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
          folder: "payment_proofs", // Ganti folder ke payment_proofs
          transformation: [
            { width: 800, height: 600, crop: "limit", quality: "auto" },
          ],
        });

        paymentProofURL = imageUpload.secure_url;
      } catch (imageError) {
        console.log("Payment proof upload error:", imageError);
        return res.json({
          success: false,
          message: "Failed to upload payment proof",
          error: imageError.message,
        });
      }
    }

    // Prepare update data
    const updateData = {
      payment: true,
    };

    // Tambahkan paymentProof URL jika ada
    if (paymentProofURL) {
      updateData.paymentProof = paymentProofURL;
    }

    // Update appointment dengan payment status dan proof
    await appointmentModel.findByIdAndUpdate(appointmentId, updateData);

    res.json({
      success: true,
      message:
        "Payment proof submitted successfully. Waiting for admin verification.",
      paymentProof: paymentProofURL,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    const generateAI = await main(
      prompt +
        " Ask to know recommended specialist regarding your health concern."
    );
    console.log("Generated AI response:", generateAI);

    res.json({ success: true, data: generateAI });
  } catch (error) {
    console.error("Controller error:", error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentUser,
};
