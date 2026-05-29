import mongoose from "mongoose";

const bookingRecordSchema = new mongoose.Schema({
    bookingId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    eventType: { type: String, required: true },
    location: { type: String, required: true },
    eventDate: { type: Date },
    selectedItems: { type: Array, default: [] },
    totalAmount: { type: Number, required: true },
    bookingStatus: { type: String, required: true },
    removedAt: { type: Date, default: Date.now }
});

const bookingRecordModel =
    mongoose.models.bookingRecord ||
    mongoose.model("bookingRecord", bookingRecordSchema);

export default bookingRecordModel;