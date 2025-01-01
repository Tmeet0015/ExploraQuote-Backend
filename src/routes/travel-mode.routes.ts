import express from 'express';
import {
  createTravelMode,
  getAllTravelModes,
  updateTravelMode,
  deleteTravelMode,
} from '../controllers/travelMode.controller';

import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

// TravelMode Routes
router.post('/',authMiddleware, createTravelMode);
router.get('/',authMiddleware, getAllTravelModes);
router.put('/:id',authMiddleware, updateTravelMode);
router.delete('/:id',authMiddleware, deleteTravelMode);

export default router;
