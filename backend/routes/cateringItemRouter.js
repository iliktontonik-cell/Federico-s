import express from "express";
import { addCateringItem, listCateringItems, removeCateringItem } from "../controllers/cateringItemController.js";
import multer from "multer";

const cateringItemRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => cb(null, `${Date.now()}${file.originalname}`)
});
const upload = multer({ storage });

cateringItemRouter.post("/add",    upload.single("image"), addCateringItem);
cateringItemRouter.get("/list",    listCateringItems);
cateringItemRouter.post("/remove", removeCateringItem);

export default cateringItemRouter;  