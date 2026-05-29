import packageModel from "../models/packageModel.js";
import fs from "fs";

// Add package
const addPackage = async (req, res) => {
    const image_filename = `${req.file.filename}`;
    const pkg = new packageModel({
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        image: image_filename,
        pax: req.body.pax,
        packageLetter: req.body.packageLetter,
        eventType: req.body.eventType,
    });
    try {
        await pkg.save();
        res.json({ success: true, message: "Package Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding package" });
    }
};

// List all packages
const listPackages = async (req, res) => {
    try {
        const packages = await packageModel.find({});
        res.json({ success: true, data: packages });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching packages" });
    }
};

// Remove package
const removePackage = async (req, res) => {
    try {
        const pkg = await packageModel.findById(req.body.id);
        fs.unlink(`uploads/${pkg.image}`, () => {});
        await packageModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Package Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing package" });
    }
};

export { addPackage, listPackages, removePackage };