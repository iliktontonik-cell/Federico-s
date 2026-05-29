import express from "express";
import { addPackage, listPackages, removePackage } from "../controllers/packageController.js";
import multer from "multer";

const packageRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    },
});

const upload = multer({ storage });

packageRouter.post("/add", upload.single("image"), addPackage);
packageRouter.get("/list", listPackages);
packageRouter.post("/remove", removePackage);

export default packageRouter;