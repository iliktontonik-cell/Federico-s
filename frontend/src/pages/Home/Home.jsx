import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
import { Link } from 'react-router-dom'

const Home = () => {

  const [category, setCategory] = useState("All")

  return (
    <div>
      <Header />

      {/* Catering Booking Section */}
      <div className="catering-booking-home">
        <h2>Planning an Event?</h2>
        <p>Book our catering service for birthdays, weddings, and more.</p>

        <Link to="/cateringbooking">
          <button className="catering-booking-btn">
            Catering Booking
          </button>
        </Link>
      </div>

      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
