
import adminRouter from '../routes/adminRoute.js'
import validator from "validator"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
//API for adding Doctor
const addDoctor = async (req,res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address} = req.body   
        const imageFile = req.file

        // Checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return response.json({success:false , message: "Missing Details"})
        }
        
        //validating the email format
        if(!validator.isEmail(email)){
            return res.json({
                success: false,
                message: "Please Enter a valid Email"
            })
        }

        //validating strong password
        if (password.length < 8) {
            return res.json(
                {
                    success:false,
                    message:"Please enter a strong password"
                }
            )
            
        }

        // hashing doctor's password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        // upload Image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address), // it will store the address as object in databas
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save() //after that our data will be stores in the database
        
        res.json({success:true, message:"Doctor Added"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//Api for the admin logo
const loginAdmin = async(req, res) => {
    try {
        /*in this try block first we will get the emailId and Password from the request
        and we will match that emailId and password with that .env 
        if it is matching then  in that case we will generate one token using jsonWeb Token */

        const {email, password} = req.body
        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true, token})
        }
        else{
            res.json({success:false, message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}
export {addDoctor, loginAdmin}