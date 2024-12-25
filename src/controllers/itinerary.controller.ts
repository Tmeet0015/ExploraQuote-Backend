import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Itinerary } from "../entity/itineraries";

  const itineraryRepository = AppDataSource.getRepository(Itinerary);

  export const createItinerary = async(req: Request, res: Response) => {
    try {
      const itineraryData = itineraryRepository.create(req.body); // Create an entity instance
      const savedItinerary = await itineraryRepository.save(itineraryData); // Save to the database
      res.status(201).json(savedItinerary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const getItineraries = async(req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const [itineraries, total] = await itineraryRepository.findAndCount({
        where: { ...filters }, // Apply filters dynamically
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      res.status(200).json({ data: itineraries, total, page, limit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const getItineraryById = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const itineraryData = await itineraryRepository.findOneBy({ itinerary_id: Number(id) });

      if (!itineraryData) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.status(200).json(itineraryData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const updateItinerary = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await itineraryRepository.update(id, req.body); // Update itinerary
      const updatedItinerary = await itineraryRepository.findOneBy({ itinerary_id: Number(id) });

      if (!updatedItinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.status(200).json(updatedItinerary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export const deleteItinerary = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteResult = await itineraryRepository.delete(id);

      if (!deleteResult.affected) {
        return res.status(404).json({ message: "Itinerary not found" });
      }

      res.status(200).json({ message: "Itinerary deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
