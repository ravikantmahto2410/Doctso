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

//API to mark appointment completed for doctor panel

const appointmentComplete = async (req,res) => {
    try {
        
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
            return res.json({success:true, message:'Appointment completed'})
        } else {
            return res.json({success:false, message:'Mark Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API to cancel appointment for doctor panel

const appointmentCancel = async (req,res) => {
    try {
        
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true, message:'Appointment cancelled'})
        } else {
            return res.json({success:false, message:'Cancellation Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API To get dashboard for doctor panel

const doctorDashboard = async (req,res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({docId})

        let earnings = 0
        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }
        res.json({success:true, dashData})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API To get Doctor Profile for Doctor Panel
const doctorProfile = async (req,res) => {
    try {
        
        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success:true, profileData})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API To update the doctorProfile data from doctor panel
const updateDoctorProfile = async (req,res) => {
    try {
       
        const {docId, fees, address, available} = req.body //doctor can edit these properties

        await doctorModel.findByIdAndUpdate(docId,{fees, address, available}) // by executing this statement it will update the doctor data with latest fees,and available property

        res.json({success: true, message:'Profile Updated'})


    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}
export {
    changeAvailablity,
    doctorList, 
    loginDoctor, 
    appointmentsDoctor, 
    appointmentComplete,
    appointmentCancel, 
    doctorDashboard, 
    doctorProfile, 
    updateDoctorProfile
}