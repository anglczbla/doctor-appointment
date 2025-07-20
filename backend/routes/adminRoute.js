import express from 'express'
import { addDoctor, loginAdmin, allDoctor } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'

const adminRouter =  express.Router()

adminRouter.post('/add-doctor', authAdmin,upload.single('image'),addDoctor)
adminRouter.get('/all-doctor', authAdmin,allDoctor)
adminRouter.post('/login',loginAdmin)


export default adminRouter