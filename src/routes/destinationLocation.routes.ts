import express from "express";
import {
  getAllDestinationLocations,
  getDestinationLocationById,
  addDestinationLocation,
  updateDestinationLocation,
  deleteDestinationLocation,
} from "../controllers/destinationLocation.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.get("/", authMiddleware, getAllDestinationLocations); // Read All
router.get("/:id", authMiddleware, getDestinationLocationById); // Read One
router.post("/", authMiddleware, addDestinationLocation); // Create
router.put("/:id", authMiddleware, updateDestinationLocation); // Update
router.delete("/:id", authMiddleware, deleteDestinationLocation); // Delete

export default router;
