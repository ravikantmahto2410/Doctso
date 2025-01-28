import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    image:{type:String, required:true},
    speciality:{type:String, required:true},
    degree: {type:String, required:true},
    experience: {type:String, required:true},
    about:{type:String, required:true},
    available:{type:Boolean, required:true},
    fees:{type:Number, required:true},
    address:{type:String, required:true},
    date: {type:Number, required:true}, // through this date we can know when the doctor was added in the database
    slots_booked: {type:Object, default:{}}
},{minimize:false}) // if we dont write here minimize false then we cant be able to add empty slot for the doctors data

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)

export default doctorModel