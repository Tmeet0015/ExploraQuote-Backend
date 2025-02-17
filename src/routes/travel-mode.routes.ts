import express from 'express';
import {
  createTravelMode,
  getAllTravelModes,
  updateTravelMode,
  deleteTravelMode,
  getAutoIncrementTravelIndexNo,
  getTravelModeById,
} from '../controllers/travelMode.controller';

import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

// TravelMode Routes
router.get('/get-auto-increment-travel-index-no',authMiddleware, getAutoIncrementTravelIndexNo);
router.get('/get-by-id/:id',authMiddleware, getTravelModeById);
router.post('/',authMiddleware, createTravelMode);
router.get('/',authMiddleware, getAllTravelModes);
router.put('/:id',authMiddleware, updateTravelMode);
router.delete('/:id',authMiddleware, deleteTravelMode);

export default router;
