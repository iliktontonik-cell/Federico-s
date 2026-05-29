import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import StoreContextProvider from './context/StoreContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </StoreContextProvider>
  </BrowserRouter>
)