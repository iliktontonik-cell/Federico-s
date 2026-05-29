import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    eventType: '',
    pax: '',
    location: '',
    selectedPrice: '',
    selectedPackage: '',
  })

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)