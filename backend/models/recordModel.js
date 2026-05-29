import mongoose from "mongoose"

const recordSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    removedAt: { type: Date, default: Date.now }
})

const recordModel = mongoose.models.record || mongoose.model("record", recordSchema);

export default recordModel;