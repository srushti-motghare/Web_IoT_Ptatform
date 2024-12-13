import express from "express";
const router = express.Router();
import {
  postGPSData,
  getGPSData,
  getNodeById,
} from "../controllers/gpsDataController.js";

router.post("/postgps", postGPSData);
router.get("/getgps", getGPSData);
router.get("/cattlenode/:nodeId", getNodeById);

export default router;
