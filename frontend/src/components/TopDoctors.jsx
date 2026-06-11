import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext, } from '../context/AppContext'
import { RotatingLines } from 'react-loader-spinner'

const TopDoctors = () => {
    const navigate = useNavigate()

    const { doctors,loading } = useContext(AppContext)
    if (loading) {
        return (
            <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 min-h-[400px]'>
                <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
                
                <div className="flex justify-center items-center mt-10">
                    <RotatingLines
                        strokeColor="#3b82f6"
                        strokeWidth="5"
                        width="70"
                        visible={true}
                    />
                </div>
                <p className="text-gray-600 mt-4">Loading top doctors...</p>
            </div>
        )
    }
    
  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
        <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
        
        <p className='sm:w-1/3 text-center text-small'>Create Account or Login to see Availability</p>
        <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {doctors.slice(0,10).map((item,index) => (
            <div
            onClick = {() => {navigate(`/appointments/${item._id}`); scrollTo(0,0)}}
            className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
            key={index}>
                <img 
                className='bg-blue-50'
                src={item.image} alt=""/>
                <div className="p-4">
                    <div className={`flex items-center gap-2 text-sm text-center ${item.available ? ' text-green-500' : 'text-gray-500' }`}>
                        <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                        <p>{item.available ? 'Available' : 'Not Available'}</p>
                    </div>
                    <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
            </div>
        ))}
            
        </div>
        <button 
        onClick = {() => { navigate('/doctors'); scrollTo(0,0)}}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10">more</button>
    </div>
  )
}

export default TopDoctors