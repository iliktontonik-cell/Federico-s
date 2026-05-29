import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './BookingReceipt.css';

const BookingReceipt = () => {
  const { url } = useContext(StoreContext);
  const { state } = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // bookingId can come from router state (passed by Verify or Navbar) or fallback to localStorage
  const bookingId = state?.bookingId || localStorage.getItem('receipt_bookingId');

  useEffect(() => {
    if (!bookingId) {
      navigate('/');
      return;
    }
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${url}/api/booking/list`);
        if (res.data.success) {
          const found = res.data.data.find(b => b._id === bookingId);
          if (found) {
            setBooking(found);
            // ✅ Do NOT remove from localStorage here —
            //    we keep it so "My Receipt" in the navbar stays visible
            //    until the user logs out.
          }
        }
      } catch (err) {
        console.error('Failed to fetch booking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="receipt-loading">
        <div className="receipt-spinner" />
        <p>Loading your receipt...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="receipt-loading">
        <p>Receipt not found.</p>
        <button onClick={() => navigate('/')} className="receipt-home-btn">Go Home</button>
      </div>
    );
  }

  // Separate the package item from add-ons
  const packageItem  = booking.selectedItems?.[0];
  const addOnItems   = booking.selectedItems?.slice(1) || [];
  const serviceCharge = 80;

  return (
    <div className="receipt-page">

      {/* ── Background decoration ── */}
      <div className="receipt-bg-circle receipt-bg-circle--1" />
      <div className="receipt-bg-circle receipt-bg-circle--2" />

      <div className="receipt-wrapper">

        {/* ── Header ── */}
        <div className="receipt-header">
          <div className="receipt-check">
            <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 27L22 35L38 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="receipt-title">Payment Confirmed!</h1>
          <p className="receipt-subtitle">Your catering booking has been successfully placed.</p>
          <div className="receipt-id-pill">Booking ID: <span>{booking._id}</span></div>
        </div>

        {/* ── Card ── */}
        <div className="receipt-card">

          {/* ── Decorative top bar ── */}
          <div className="receipt-card-topbar" />

          {/* ── Customer & Event Info ── */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">
              <span className="receipt-section-icon">👤</span> Customer Details
            </h2>
            <div className="receipt-grid-2">
              <div className="receipt-field">
                <span className="receipt-label">Name</span>
                <span className="receipt-value">{booking.customerName}</span>
              </div>
              <div className="receipt-field">
                <span className="receipt-label">Email</span>
                <span className="receipt-value">{booking.email}</span>
              </div>
              <div className="receipt-field">
                <span className="receipt-label">Event Type</span>
                <span className="receipt-value">{booking.eventType}</span>
              </div>
              <div className="receipt-field">
                <span className="receipt-label">Event Date</span>
                <span className="receipt-value">{formatDate(booking.eventDate)}</span>
              </div>
              <div className="receipt-field receipt-field--full">
                <span className="receipt-label">Venue / Location</span>
                <span className="receipt-value">{booking.location}</span>
              </div>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* ── Items ── */}
          <div className="receipt-section">
            <h2 className="receipt-section-title">
              <span className="receipt-section-icon">📋</span> Booking Items
            </h2>

            <div className="receipt-items-table">
              <div className="receipt-items-head">
                <span>Item</span>
                <span>Qty</span>
                <span>Price</span>
              </div>

              {/* Package */}
              {packageItem && (
                <div className="receipt-item-row receipt-item-row--package">
                  <span className="receipt-item-name">
                    {packageItem.name}
                    <em className="receipt-item-tag">Package</em>
                  </span>
                  <span>{packageItem.quantity}</span>
                  <span>₱{(packageItem.price * packageItem.quantity).toLocaleString()}</span>
                </div>
              )}

              {/* Add-ons */}
              {addOnItems.map((item, i) => (
                <div className="receipt-item-row" key={i}>
                  <span className="receipt-item-name">
                    {item.name}
                    <em className="receipt-item-tag receipt-item-tag--addon">Add-on</em>
                  </span>
                  <span>{item.quantity}</span>
                  <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              {/* Service Charge */}
              <div className="receipt-item-row receipt-item-row--service">
                <span className="receipt-item-name">Service Charge</span>
                <span>1</span>
                <span>₱{serviceCharge.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* ── Total ── */}
          <div className="receipt-total-row">
            <span>Total Paid</span>
            <span className="receipt-total-amount">₱{booking.totalAmount.toLocaleString()}</span>
          </div>

          {/* ── Status ── */}
          <div className="receipt-status-row">
            <div className="receipt-status-badge receipt-status-badge--paid">
              ✓ Payment Successful
            </div>
            <div className="receipt-status-badge receipt-status-badge--pending">
              ⏳ Booking: {booking.bookingStatus || 'Processing'}
            </div>
          </div>

          {/* ── Note ── */}
          <div className="receipt-note">
            📩 A confirmation will be sent to <strong>{booking.email}</strong>. Our team will reach out shortly to confirm your booking details.
          </div>

        </div>

        {/* ── Actions ── */}
        <div className="receipt-actions">
          <button className="receipt-btn receipt-btn--print" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="receipt-btn receipt-btn--orders" onClick={() => navigate('/myorders')}>
            My Bookings
          </button>
          <button className="receipt-btn receipt-btn--home" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingReceipt;