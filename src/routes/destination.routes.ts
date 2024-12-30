import express from "express";
import {
  createDestination,
  getAllDestination,
  getOneDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationLocation.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/", authMiddleware, createDestination); // Create
router.post("/get-all", authMiddleware, getAllDestination); // Read All
router.get("/:id", authMiddleware, getOneDestination); // Read One
router.put("/:id", authMiddleware, updateDestination); // Update
router.delete("/:id", authMiddleware, deleteDestination); // Delete

export default router;
