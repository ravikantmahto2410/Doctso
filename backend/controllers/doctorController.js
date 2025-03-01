import doctorModel from "../models/doctorModel.js"


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
export {changeAvailablity,doctorList}