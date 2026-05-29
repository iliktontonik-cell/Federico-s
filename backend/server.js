import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import bookingRouter from "./routes/bookingRoute.js"
import packageRouter from "./routes/packageRouter.js"
import cateringItemRouter from "./routes/cateringItemRouter.js"


// app cofig"
const app = express()
const port = process.env.PORT || 5000;

// moddleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/booking",bookingRouter)
app.use("/api/package", packageRouter);
app.use("/api/cateringitem", cateringItemRouter);


app.get("/",(req,res)=>{
    res.send("Hello Man")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
