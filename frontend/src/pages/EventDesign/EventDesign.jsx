import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './EventDesign.css'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const PAX_SIZES = [
  "50 PAX","100 PAX","150 PAX","200 PAX","250 PAX",
  "300 PAX","350 PAX","400 PAX","450 PAX","500 PAX","550 PAX","600 PAX"
];

const EventDesign = () => {
  const navigate  = useNavigate()
  const { state } = useLocation()
  const eventType = state?.eventType

  const [selectedCategory, setSelectedCategory] = useState('50 PAX')
  const [selectedPackage,  setSelectedPackage]  = useState(null)
  const [previewImage,     setPreviewImage]     = useState(null)

  const [allPackages, setAllPackages] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const res  = await fetch(`${BACKEND_URL}/api/package/list`)
        const data = await res.json()
        if (data.success) {
          setAllPackages(data.data)
        } else {
          setError("Failed to load packages.")
        }
      } catch (err) {
        console.error(err)
        setError("Could not connect to server.")
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  // Filter by PAX only — no eventType filter
  const currentPackages = useMemo(() => {
    return allPackages
      .filter(pkg => pkg.pax === selectedCategory)
      .map(pkg => ({
        id:          `Package ${pkg.packageLetter} (${pkg.pax})`,
        _id:         pkg._id,
        title:       `Package ${pkg.packageLetter}`,
        image:       `${BACKEND_URL}/images/${pkg.image}`,
        pax:         pkg.pax,
        price:       pkg.price,
        description: pkg.description,
      }))
  }, [allPackages, selectedCategory])

  if (!eventType) {
    return (
      <div className="event-design-empty">
        <h1>No Event Selected</h1>
        <button className="primary-btn" onClick={() => navigate('/booking')}>Go Back</button>
      </div>
    )
  }

  const handleConfirm = () => {
    if (!selectedPackage) { alert('Please select a package first.'); return }

    const pkg = currentPackages.find(p => p.id === selectedPackage)

    navigate('/event-setup', {
      state: {
        eventType,
        selectedItems:    [selectedPackage],
        location:         state?.location,
        selectedCategory,
        pax:              pkg.pax,
        packageLabel:     pkg.title,
        packagePrice:     pkg.price,
      }
    })
  }

  return (
    <div className="event-design-page">

      {/* HEADER */}
      <div className="event-header">
        <div>
          <p className="event-subtitle">Choose your setup</p>
          <h1>{eventType} Packages</h1>
        </div>
        <div className="selected-pill">{selectedCategory}</div>
      </div>

      {/* PAX CATEGORY BUTTONS */}
      <div className="category-scroll">
        {PAX_SIZES.map(category => (
          <button
            key={category}
            className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => { setSelectedCategory(category); setSelectedPackage(null) }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* PACKAGES */}
      <div className="packages-section">

        {loading ? (
          <div className="coming-soon-card"><p>Loading packages...</p></div>

        ) : error ? (
          <div className="coming-soon-card"><p style={{ color: 'red' }}>{error}</p></div>

        ) : currentPackages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }}
          >
            {currentPackages.map(pkg => (
              <SwiperSlide key={pkg.id}>
                <div
                  className={`package-card ${selectedPackage === pkg.id ? 'active' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >

                  <div className="package-image-wrapper">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="package-image"
                      onClick={(e) => { e.stopPropagation(); setPreviewImage(pkg.image) }}
                    />
                    <div className="package-overlay"><span>{pkg.pax}</span></div>
                    <div className="zoom-hint">Click image to expand</div>
                  </div>

                  <div className="package-content">
                    <h3>{pkg.title}</h3>
                    <p className="package-price">₱{pkg.price.toLocaleString()}</p>
                    <p className="package-desc">{pkg.description}</p>
                    <button className="select-btn">
                      {selectedPackage === pkg.id ? 'Selected ✓' : 'Select Package'}
                    </button>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        ) : (
          <div className="coming-soon-card">
            <h2>{selectedCategory} Packages</h2>
            <p>No packages available yet. Check back soon!</p>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="bottom-actions">
        <button className="secondary-btn" onClick={() => navigate(-1)}>Back</button>
        <button className="primary-btn" onClick={handleConfirm}>Confirm Package</button>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="image-preview-modal" onClick={() => setPreviewImage(null)}>
          <button className="close-preview" onClick={() => setPreviewImage(null)}>✕</button>
          <img src={previewImage} alt="Menu Preview" className="preview-image" />
        </div>
      )}

    </div>
  )
}

export default EventDesign