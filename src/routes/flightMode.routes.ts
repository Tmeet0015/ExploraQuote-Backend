import express from 'express';
import {
  createFlightDetails,
  getAllFlightDetails,
  updateFlightDetails,
  deleteFlightDetails,
} from '../controllers/flightMode.controller';
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

// FlightDetails Routes
router.post('/',authMiddleware,  createFlightDetails);
router.get('/',authMiddleware,  getAllFlightDetails);
router.put('/:id',authMiddleware,  updateFlightDetails);
router.delete('/:id',authMiddleware,  deleteFlightDetails);

export default router;
