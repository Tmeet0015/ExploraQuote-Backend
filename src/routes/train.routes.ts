import express from "express";
import {
  createTrainDetails,
  getAllTrainDetails,
  updateTrainDetails,
  deleteTrainDetails,
} from "../controllers/train.controller";


const router = express.Router();

// Train Details Routes
router.post("/", createTrainDetails);
router.get("/", getAllTrainDetails);
router.put("/:id", updateTrainDetails);
router.delete("/:id", deleteTrainDetails);

export default router;
