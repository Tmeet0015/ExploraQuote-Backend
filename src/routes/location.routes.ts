import express from "express";
import {
  createLocation,
  getAllLocation,
  getOneLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/destinationLocation.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/", authMiddleware, createLocation); // Create
router.post("/get-all", authMiddleware, getAllLocation); // Read All
router.get("/:id", authMiddleware, getOneLocation); // Read One
router.put("/:id", authMiddleware, updateLocation); // Update
router.delete("/:id", authMiddleware, deleteLocation); // Delete

export default router;
