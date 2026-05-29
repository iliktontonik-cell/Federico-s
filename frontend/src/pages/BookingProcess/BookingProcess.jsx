import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import './BookingProcess.css';

const EVENT_TYPES = [
  "Fiesta",
  "Birthday",
  "Debut",
  "Christmas",
  "Beach Party",
  "Wedding",
  "Christening",
];

const BookingProcess = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { token, url, userId } = useContext(StoreContext);

  // ── FIX: wait for token to be loaded before deciding to redirect ──
  const [tokenChecked, setTokenChecked] = useState(false);

  const addOnItems  = state?.addOnItems  || [];
  const addOnsTotal = state?.addOnsTotal || 0;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    eventType: "",
    eventDate: "",
    pax: "",
    packageLabel: "",
    packagePrice: 0,
    location: "",
    additionalRequests: ""
  });

  // ── Give the context a tick to rehydrate token from storage ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setTokenChecked(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // ── Only redirect after we've confirmed token is truly absent ──
  useEffect(() => {
    if (tokenChecked && !token) {
      navigate('/');
    }
  }, [tokenChecked, token]);

  useEffect(() => {
    if (state) {
      setData((prev) => ({
        ...prev,
        pax: state.pax || "",
        packageLabel: state.packageLabel || "",
        packagePrice: state.packagePrice || 0,
        eventType: state.eventType || prev.eventType,
      }));
    }
  }, [state]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      userId: userId,
      customerName: `${data.firstName} ${data.lastName}`,
      email: data.email,
      eventType: data.eventType,
      location: data.location,
      eventDate: data.eventDate,
      selectedItems: [
        {
          name: data.packageLabel,
          price: data.packagePrice,
          quantity: 1,
        },
        ...addOnItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      ],
      totalAmount: data.packagePrice + addOnsTotal + 80,
    };

    try {
      const response = await axios.post(`${url}/api/booking/book`, bookingData, {
        headers: { token },
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        console.log("RESPONSE:", response.data);
        alert(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  const formatPax = (pax) => {
    if (!pax) return "—";
    return `${pax.replace(/\s*PAX/i, '')} pax`;
  };

  // ── Show nothing while waiting for token check to complete ──
  if (!tokenChecked) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="booking-process">

      {/* LEFT SIDE */}
      <div className="booking-process-left">

        <p className="title">Catering Booking</p>

        <div className="multi-field">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>

        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email Address"
          required
        />

        <select
          name="eventType"
          onChange={onChangeHandler}
          value={data.eventType}
          required
        >
          <option value="">Select Event Type</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="multi-field">
          <input
            name="eventDate"
            onChange={onChangeHandler}
            value={data.eventDate}
            type="date"
            required
          />
          <input
            type="text"
            value={
              data.packageLabel
                ? `${data.packageLabel} - ${formatPax(data.pax)}`
                : ""
            }
            readOnly
          />
        </div>

        <input
          name="location"
          onChange={onChangeHandler}
          value={data.location}
          type="text"
          placeholder="Event Location / Venue"
          required
        />

        <textarea
          name="additionalRequests"
          onChange={onChangeHandler}
          value={data.additionalRequests}
          placeholder="Any special instructions or requests"
        />

      </div>

      {/* RIGHT SIDE */}
      <div className="booking-process-right">

        <div className="booking-summary">

          <h2>Booking Summary</h2>

          <div className="summary-details">
            <p>Event Type</p>
            <p>{data.eventType || "—"}</p>
          </div>

          <div className="summary-details">
            <p>Date</p>
            <p>{data.eventDate || "—"}</p>
          </div>

          <div className="summary-details">
            <p>Package</p>
            <p>{data.packageLabel || "—"}</p>
          </div>

          <div className="summary-details">
            <p>Guests</p>
            <p>{formatPax(data.pax)}</p>
          </div>

          <div className="summary-details">
            <p>Package Price</p>
            <p>
              {data.packagePrice > 0
                ? `₱${data.packagePrice.toLocaleString()}`
                : "—"}
            </p>
          </div>

          <div className="summary-details">
            <p>Service Charge</p>
            <p>₱80.00</p>
          </div>

          {addOnItems.length > 0 && (
            <>
              <div className="summary-details">
                <p style={{ fontWeight: 600 }}>Add-ons</p>
                <p></p>
              </div>
              {addOnItems.map((item, i) => (
                <div className="summary-details" key={i} style={{ paddingLeft: '0.75rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#555' }}>
                    {item.name} ×{item.quantity}
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="summary-details">
                <p style={{ fontSize: '0.85rem', color: '#777' }}>Add-ons subtotal</p>
                <p style={{ fontSize: '0.85rem' }}>₱{addOnsTotal.toLocaleString()}</p>
              </div>
            </>
          )}

          <div className="summary-details">
            <p>Location</p>
            <p>{data.location || "—"}</p>
          </div>

          <hr />

          <div className="summary-details total">
            <b>Total Amount</b>
            <b>
              {data.packagePrice > 0
                ? `₱${(data.packagePrice + addOnsTotal + 80).toLocaleString()}`
                : "—"}
            </b>
          </div>

          <div className="summary-details total">
            <b>Status</b>
            <b>
              {data.eventType && data.eventDate && data.location
                ? "Ready"
                : "Incomplete"}
            </b>
          </div>

          <button type="submit">CONTINUE BOOKING</button>

        </div>

      </div>

    </form>
  );
};

export default BookingProcess;