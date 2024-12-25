import { Router } from "express";
import { createItinerary, deleteItinerary, getItineraries, getItineraryById, updateItinerary } from "../controllers/itinerary.controller";
import { authMiddleware } from "../middleware/jwt";

const itineraryRouter = Router();

// Route to create an itinerary
itineraryRouter.post("/", authMiddleware, createItinerary);

// Route to get all itineraries with filters and pagination
itineraryRouter.get("/", authMiddleware, getItineraries);

// Route to get a single itinerary by ID
itineraryRouter.get("/:id", authMiddleware, getItineraryById);

// Route to update an itinerary
itineraryRouter.put("/:id", authMiddleware, updateItinerary);

// Route to delete an itinerary
itineraryRouter.delete("/:id", authMiddleware, deleteItinerary);

export default itineraryRouter;
