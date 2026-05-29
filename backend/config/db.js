import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://greatstack:FvXiofDpuMRlT37U@cluster0.yk3r0dq.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}