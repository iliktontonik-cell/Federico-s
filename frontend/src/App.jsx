import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import CateringBooking from './pages/CataringBooking/CateringBooking'
import Footer from './components/Footer/Footer'
import BookingProcess from './pages/BookingProcess/BookingProcess'
import EventDesign from './pages/EventDesign/EventDesign'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import BookingReceipt from './pages/BookingReceipt/BookingReceipt'
// ✅ Correct
import EventSetup from './pages/Eventsetup/EventSetup'  // ← NEW


const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path='/'                          element={<Home />} />
          <Route path='/cart'                      element={<Cart />} />
          <Route path='/order'                     element={<PlaceOrder />} />
          <Route path='/cateringbooking'           element={<CateringBooking />} />
          <Route path='/verify'                    element={<Verify />} />
          <Route path='/cateringbooking/process'   element={<BookingProcess />} />
          <Route path='/event-design'              element={<EventDesign />} />
          <Route path='/myorders'                  element={<MyOrders />} />
          <Route path='/event-setup'               element={<EventSetup />} />
          <Route path='/booking-receipt'           element={<BookingReceipt />} />  {/* ← NEW */}
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App