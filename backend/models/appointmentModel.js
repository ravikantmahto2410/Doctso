import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: {type: String, required: true}, 
    docId: {type: String, required: true},
    slotDate: {type: String, required: true},
    slotTime: {type: String, required: true},
    userData: {type: Object, required: true},
    docData: {type: Object, required: true},
    amount: {type: Number, required: true}, //in this amount we will save  the amount of the booked appointment
    date: {type: Number, required: true},//to store the the date , when appointment was Booked
    cancelled: { type: Boolean, default: false}, // when the user cancels the appointment , then  we will make this data true
    payment:{type: Boolean,default: false },  //we will make this payment property , if the user has made the payment online, then we will make it true, if the user has not paid the amount then we will make it false 
    isCompleted: {type: Boolean, default: false}
})

const appointmentModel = mongoose.models.appointment ||mongoose.model("appointment", appointmentSchema);

export default appointmentModel