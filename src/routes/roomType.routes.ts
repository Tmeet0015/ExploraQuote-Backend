import express from "express";
import {
  createRoomType,
  getAllRoomTypes,
  updateRoomType,
  deleteRoomType,
} from "../controllers/roomType.controller";

const router = express.Router();

router.post("/", createRoomType);
router.post("/list", getAllRoomTypes);
router.put("/:id", updateRoomType);
router.delete("/:id", deleteRoomType);

export default router;
