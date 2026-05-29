import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './CateringBooking.css'
import { assets } from '../../assets/assets'

const images = [
  assets.moving1,
  assets.moving2,
  assets.moving3,
  assets.moving4,
  assets.moving5,
  assets.moving6,
]

const CateringBooking = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="catering-home"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 1s ease-in-out',
      }}
    >
      <section className="catering-hero">
        <div className="hero-text-overlay">
          <h1>Book Your Catering With Ease</h1>
          <p>
            Make your celebrations memorable with our delicious food and
            professional catering service.
          </p>
          <button
            className="catering-btn"
            onClick={() => navigate('/event-design', { state: { eventType: 'Catering' } })}
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  )
}

export default CateringBooking