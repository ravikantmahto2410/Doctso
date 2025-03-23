import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity = async (req,res)=> {
    try {
        //In this try block we will add the logic so that we can change the available status from the database

        const {docId} = req.body
        const docData = await doctorModel.findById(docId)//we have to find doctors data using this docId
        await doctorModel.findByIdAndUpdate(docId,{available : !docData.available})
        res.json({success: true, message: 'Availablity Changed'})
    
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
//we have to create one function so that we can get all doctors listfor frontend
const doctorList = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API for doctor login
const loginDoctor = async (req,res) => {
    try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success:false,message:'Invalid Credentials'})
        }

        const ismatch = await bcrypt.compare(password, doctor.password)

        if(ismatch){
            const token = jwt.sign({id:doctor._id}, process.env.JWT_SECRET)

            res.json({success:true,token})
        } else {
            res.json({success:false,message:'Invalid Credentials'})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API to get doctor appointments for doctor panel

const appointmentsDoctor = async (req,res) => {
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({success:true, appointments})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
export {changeAvailablity,doctorList,loginDoctor, appointmentsDoctor}