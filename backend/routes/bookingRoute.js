import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
    BookingProcess,
    verifyBooking,
    userBookings,
    listBookings,
    updateBookingStatus,
    removeBooking,
    getBookingRecords,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/book", authMiddleware, BookingProcess);
bookingRouter.post("/verify", verifyBooking);
bookingRouter.post("/userbookings", authMiddleware, userBookings);
bookingRouter.get("/list", listBookings);
bookingRouter.post("/status", updateBookingStatus);
bookingRouter.delete("/remove/:id", removeBooking);
bookingRouter.get("/records", getBookingRecords);

export default bookingRouter;