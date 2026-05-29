import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Orders from './pages/Orders/Orders'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Booking from './pages/Booking/Booking'
import Records from './pages/Records/Records'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:5000"

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/add"      element={<Add url={url}/>}/>
          <Route path="/list"     element={<List url={url}/>}/>
          <Route path="/orders"   element={<Orders url={url}/>}/>
          <Route path="/booking"  element={<Booking url={url}/>}/>
          <Route path="/records"  element={<Records url={url}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App