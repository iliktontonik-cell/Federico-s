import bookingModel from "../models/bookingModel.js";
import bookingRecordModel from "../models/bookingRecordModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BookingProcess = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const newBooking = new bookingModel({
            userId: req.body.userId,
            customerName: req.body.customerName,
            email: req.body.email,
            eventType: req.body.eventType,
            location: req.body.location,
            eventDate: req.body.eventDate,
            selectedItems: req.body.selectedItems,
            totalAmount: req.body.totalAmount,
        });
        await newBooking.save();
        await userModel.findByIdAndUpdate(req.body.userId, { bookingData: {} });

        const line_items = req.body.selectedItems.map((item) => ({
            price_data: {
                currency: "php",
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: "php",
                product_data: { name: "Service Charge" },
                unit_amount: 8000,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&bookingId=${newBooking._id}`,
            cancel_url: `${frontend_url}/verify?success=false&bookingId=${newBooking._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log("BOOKING ERROR:", error.message);
        res.json({ success: false, message: error.message });
    }
};

const verifyBooking = async (req, res) => {
    const { bookingId, success } = req.body;
    try {
        if (success === "true") {
            await bookingModel.findByIdAndUpdate(bookingId, { payment: true });
            res.json({ success: true, message: "Paid" });
        } else {
            await bookingModel.findByIdAndDelete(bookingId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const userBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({ userId: req.body.userId });
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const listBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({});
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        await bookingModel.findByIdAndUpdate(req.body.bookingId, {
            bookingStatus: req.body.bookingStatus
        });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const removeBooking = async (req, res) => {
    try {
        const booking = await bookingModel.findById(req.params.id);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Save to booking records before deleting
        const newRecord = new bookingRecordModel({
            bookingId: booking._id,
            customerName: booking.customerName,
            email: booking.email,
            eventType: booking.eventType,
            location: booking.location,
            eventDate: booking.eventDate,
            selectedItems: booking.selectedItems,
            totalAmount: booking.totalAmount,
            bookingStatus: booking.bookingStatus,
        });
        await newRecord.save();

        await bookingModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Booking removed and recorded" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing booking" });
    }
};

const getBookingRecords = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayRecords = await bookingRecordModel.find({
            removedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const allRecords = await bookingRecordModel.find({}).sort({ removedAt: -1 });

        res.json({
            success: true,
            todayCount: todayRecords.length,
            todayRevenue: todayRecords.reduce((sum, r) => sum + r.totalAmount, 0),
            data: allRecords
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching booking records" });
    }
};

export { BookingProcess, verifyBooking, userBookings, listBookings, updateBookingStatus, removeBooking, getBookingRecords };