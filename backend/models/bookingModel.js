import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    eventType: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    eventDate: {
        type: Date,
        required: true
    },

    selectedItems: {
        type: Array,
        default: []
    },

    totalAmount: {
        type: Number,
        required: true
    },

    payment: {
        type: Boolean,
        default: "false"
    },

    bookingStatus: {
        type: String,
        default: "Processing"
    },
    

}, { timestamps: true });

const bookingModel =
    mongoose.models.booking ||
    mongoose.model("booking", bookingSchema);

export default bookingModel;