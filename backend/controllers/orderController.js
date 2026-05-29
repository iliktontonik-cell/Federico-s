import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import recordModel from "../models/recordModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartdata: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "php",
                product_data: { name: item.name },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: "php",
                product_data: { name: "Delivery Charges" },
                unit_amount: 2 * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, session_url: session.url })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const removeOrder = async (req, res) => {
    try {
        // Find the order first to save its data
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Save to records before deleting
        const newRecord = new recordModel({
            orderId: order._id,
            customerName: order.address.firstName + " " + order.address.lastName,
            items: order.items,
            amount: order.amount,
            status: order.status,
        });
        await newRecord.save();

        // Now delete the order
        await orderModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Order removed and recorded" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing order" });
    }
}

const getRecords = async (req, res) => {
    try {
        // Get today's start and end
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayRecords = await recordModel.find({
            removedAt: { $gte: startOfDay, $lte: endOfDay }
        });

        const allRecords = await recordModel.find({}).sort({ removedAt: -1 });

        res.json({
            success: true,
            todayCount: todayRecords.length,
            todayRevenue: todayRecords.reduce((sum, r) => sum + r.amount, 0),
            data: allRecords
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching records" });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, removeOrder, getRecords }