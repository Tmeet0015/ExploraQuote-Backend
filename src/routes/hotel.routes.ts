import express from "express";
import { createHotel, deleteHotel, getHotels, updateHotel } from "../controllers/hotel.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/", authMiddleware, createHotel);
router.get("/", authMiddleware, getHotels);
router.put("/:id", authMiddleware, updateHotel);
router.delete("/:id", authMiddleware, deleteHotel);

export default router;
