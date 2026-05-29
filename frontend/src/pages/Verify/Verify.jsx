import React, { useContext, useEffect } from "react";
import './Verify.css'
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const Verify = () => {

    const [searchParams] = useSearchParams();
    const success   = searchParams.get("success");
    const orderId   = searchParams.get("orderId");
    const bookingId = searchParams.get("bookingId");
    const { url }   = useContext(StoreContext);
    const navigate  = useNavigate();

    const verifyPayment = async () => {
        try {
            if (bookingId) {
                // BOOKING FLOW
                const response = await axios.post(url + "/api/booking/verify", { success, bookingId });
                console.log("Booking verify response:", response.data);
                if (response.data.success) {
                    // ── Save bookingId to localStorage so receipt page survives a refresh ──
                    localStorage.setItem('receipt_bookingId', bookingId);
                    navigate('/booking-receipt', { state: { bookingId }, replace: true });
                } else {
                    navigate("/");
                }
            } else if (orderId) {
                // ORDER FLOW — unchanged
                const response = await axios.post(url + "/api/order/verify", { success, orderId });
                console.log("Order verify response:", response.data);
                if (response.data.success) {
                    navigate("/myorders");
                } else {
                    navigate("/");
                }
            } else {
                // NEITHER — go home
                navigate("/");
            }
        } catch (error) {
            console.error("Verify error:", error);
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, []);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify;