import cateringItemModel from "../models/cateringItemModel.js";
import fs from "fs";

const addCateringItem = async (req, res) => {
    const image_filename = `${req.file.filename}`;
    const item = new cateringItemModel({
        name:        req.body.name,
        description: req.body.description,
        price:       Number(req.body.price),
        image:       image_filename,
        category:    req.body.category,
        // ── Visual Elements (optional — default "" if not sent) ──
        style:       req.body.style    || "",
        colors:      req.body.colors   || "",
        vibe:        req.body.vibe     || "",
        lighting:    req.body.lighting || "",
    });
    try {
        await item.save();
        res.json({ success: true, message: "Catering Item Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding item" });
    }
};

const listCateringItems = async (req, res) => {
    try {
        const items = await cateringItemModel.find({});
        res.json({ success: true, data: items });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching items" });
    }
};

const removeCateringItem = async (req, res) => {
    try {
        const item = await cateringItemModel.findById(req.body.id);
        fs.unlink(`uploads/${item.image}`, () => {});
        await cateringItemModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Item Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing item" });
    }
};

export { addCateringItem, listCateringItems, removeCateringItem };