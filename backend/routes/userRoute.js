import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment,cancelAppointment, paymentUser, generateContent} from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile', authUser,getProfile)
userRouter.post('/update-profile', upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/generate-ai', authUser, generateContent)
userRouter.post('/payment', upload.single('paymentProof'), authUser, paymentUser)


export default userRouter