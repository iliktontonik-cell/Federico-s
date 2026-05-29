import mongoose from "mongoose";

const cateringItemSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: String, required: true },
    category:    { type: String, required: true },
    // ── Visual Elements (optional) ──────────────────────────
    style:       { type: String, default: "" },
    colors:      { type: String, default: "" },
    vibe:        { type: String, default: "" },
    lighting:    { type: String, default: "" },
});

const cateringItemModel = mongoose.models.cateringItem || mongoose.model("cateringItem", cateringItemSchema);
export default cateringItemModel;   