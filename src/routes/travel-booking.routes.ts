import express from "express";
import { createTravelBooking, deleteTravelBooking, getTravelBookings, updateTravelBooking } from "../controllers/travelBooking.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/", authMiddleware, createTravelBooking);
router.get("/", authMiddleware, getTravelBookings);
router.put("/:id", authMiddleware, updateTravelBooking);
router.delete("/:id", authMiddleware, deleteTravelBooking);

export default router;
