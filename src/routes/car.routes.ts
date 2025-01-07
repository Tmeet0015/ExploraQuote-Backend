import express from "express";

import {
  createCarDetails,
  getAllCarDetails,
  updateCarDetails,
  deleteCarDetails,
} from "../controllers/car.controller";

const router = express.Router();

// Car Details Routes
router.post("/", createCarDetails);
router.get("/", getAllCarDetails);
router.put("/:id", updateCarDetails);
router.delete("/:id", deleteCarDetails);

export default router;
