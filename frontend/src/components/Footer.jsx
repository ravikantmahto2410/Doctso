import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className = 'md:mx-10'>
        <div className = 'flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/*----Left Section-----  */}
            <div>
              <img className='mb-4 w-25' src={assets.logo_doctso} alt=""/>
              <p className='w-full md:w-2/3 text-gray-600 leading-6 mb-0 mt-1'>Doctso simplifies your healthcare journey by providing easy access<br/> to 
              appointments with top-rated doctors. Book your consultations <br/> conveniently 
              through our user-friendly platform and experience the ease of modern healthcare.</p>
            </div>


            {/*----Center Section-----  */}
            <div>
              <p className='text-xl font-medium mb-5'>COMPANY</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            {/*----Right Section-----  */}
            <div>
              <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>+91 8745791566</li>
                <li>contact.doctso@gmail.com</li>
              </ul>
            </div>
        </div>

        {/* -----Copyright Text ------ */}
        <hr/>

        <p className='py-5 text-sm text-center'>Copyright 2024 Doctso - All Right Reserved</p>
    </div>
  )
}

export default Footer