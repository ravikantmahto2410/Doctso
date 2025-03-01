import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyProfile from './pages/MyProfile'
import Navbar from './components/Navbar'
import MyAppointments from './pages/MyAppointments'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
function App() {
  return (
    <div className = "mx-4 sm:mx-[10%]">
    <ToastContainer/>
      <Navbar/>   {/*We are writing this Navbar here so that it will be visible in all the pages */}
      <Routes>
        <Route path = '/' element ={<Home/>}/>
        <Route path = '/doctors' element ={<Doctors/>}/>
        <Route path = '/doctors/:speciality' element ={<Doctors/>}/>
        <Route path = '/login' element ={<Login/>}/>
        <Route path = '/about' element ={<About/>}/>
        <Route path = '/contact' element ={<Contact/>}/>
        <Route path = '/my-profile' element ={<MyProfile/>}/>
        <Route path = '/my-appointments' element ={<MyAppointments/>}/>

        <Route path = '/appointments/:docId' element ={<Appointment/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App