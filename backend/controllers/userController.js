import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
//API to register user

const registerUser = async (req, res) => {

    try {
        const {name, email, password } = req.body

        if(!name || !password || !email) {
            return res.json({success: false, message: "Missing Credentials"})
        }

        //validating correct email
        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Enter a Valid Email"})
        }
        //validating strong password
        if(password.length < 8) {
            return res.json({successs: false, message:"Enter a Strong Password"})
        }

        //Now we have the name,email and password , we have vaildated the email and password //Next we can add the user in database so firts we have to decrypt the password

        //Let's have password and decrypt hashing user password 

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //next we have to save the hashed password in database

        const userData =  {
            name,
            email,
            password: hashedPassword
        }

        const newUser =  userModel(userData)
        const user = await newUser.save() //by using this method the user will be saved in the database
        
        //in the user object we will get one _id property using this property we are going to create one token so that user can login on the website

        //to create token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET) // we have to provide JWT Secret to encrypt this token
        res.json({success:true, token}) // now we generate the the response so that we can send this token to the user
    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API for user login
const loginUser = async(req,res) => {
    try {
        
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success:false, message:'User does not exist'})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false, message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error)
        res.json({success: false, message:error.message})
    }
}
//API to get user profile data
const getProfile = async (req, res) => {
    
    try {
        const{ userId } = req.body
        const userData = await userModel.findById(userId).select(' -password ')

        res.json({success:true, userData})
    }catch (error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//We will make one more controller function so that we can update users profile
//API to update user profile

const updateProfile = async (req,res) => {
    try {
        const {userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file 

        if(!name || !phone || !dob || !gender) {
            return res.json({success: false, message: "Data Missing"})
        }
        await userModel.findByIdAndUpdate(userId,{name, phone, address:JSON.parse(address), dob, gender})
        if (imageFile) {
            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: 'image'})
            const imageURL = imageUpload.secure_url


            await userModel.findByIdAndUpdate(userId, {image: imageURL})
        }

        res.json({success:true, message:"Profile Updated"})
    } catch (error) {
        console.log(error)
        res.json({success:false})
    }
}

//API to book Appointment
const bookAppointment = async(req,res) => {
    try {
        const {userId, docId, slotDate, slotTime} = req.body

        const docData = await doctorModel.findById(docId).select('-password') //after executing this statement we will get the doctor data using docId and in the doctor data we have removed the password property using select where we have provided password

        if (!docData.available) {
            return res.json({success:false, message:'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        //checking for slots availablity
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message:'Slot not available'})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password') //here we will get the user data
        
        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }
        // To save appoitmentData in the database
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save() // by adding this method our new appoitment will be saved in the database


        //save new slots data in docData

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true, message:'Appointment Booked'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser,loginUser, getProfile, updateProfile, bookAppointment}