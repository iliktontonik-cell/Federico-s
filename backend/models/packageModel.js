import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: { type: String, required: true },        // e.g. "Package A"
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    pax: { type: String, required: true },         // e.g. "50 PAX"
    packageLetter: { type: String, required: true },// e.g. "A", "B", "C"
    eventType: { type: String, required: true },   // e.g. "Wedding", "Birthday"
});

const packageModel = mongoose.models.package || mongoose.model("package", packageSchema);
export default packageModel;