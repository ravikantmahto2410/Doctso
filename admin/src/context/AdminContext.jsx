import { createContext,useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'
export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken ,setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors,setDoctors] = useState([])
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {headers: {aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    
    const changeAvailablity = async (docId) => {//here we will create a arrow function to change the available function using the api
        try {
            const {data} = await axios.post(backendUrl + '/api/admin/change-availablity', {docId},{headers:{aToken}})
            if(data.success) {
                toast.success(data.message)
                getAllDoctors()

            } else{
                toast.error(data.messaege)
            }
        } catch (error) {
            toast.error(error.message)
        }
    } 
    const value = {
        aToken,setAToken,
        backendUrl,doctors,
        getAllDoctors, changeAvailablity,
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider