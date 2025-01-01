import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TravelBooking } from "../entity/travelBooking";

const travelBookingRepository = AppDataSource.getRepository(TravelBooking);

  // Create a Travel Booking
  export const createTravelBooking = async (req: Request, res: Response) =>  {
    try {
      const travelBooking = travelBookingRepository.create(req.body);
      await travelBookingRepository.save(travelBooking);
      return res.status(201).json(travelBooking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // List all Travel Bookings with Pagination and Relations
  export const getTravelBookings = async (req: Request, res: Response) =>  {
    try {
      const { page = 1, limit = 10 } = req.query;
      const [travelBookings, total] = await travelBookingRepository.findAndCount({
        relations: {
            itinerary : true,
            travel_mode : true
        }, 
       
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
      return res.status(200).json({ data: travelBookings, total });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Update a Travel Booking
  export const updateTravelBooking = async (req: Request, res: Response) =>  {
    try {
      const { id } = req.params;
      await travelBookingRepository.update(id, req.body);
      const updatedBooking = await travelBookingRepository.findOne({
        where: { travel_mode_booking_id: parseInt(id) },
        relations: {
            itinerary : true,
            travel_mode : true
        },
      });
      if (!updatedBooking) {
        return res.status(404).json({ message: "Travel Booking not found" });
      }
      return res.status(200).json(updatedBooking);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // Delete a Travel Booking
  export const deleteTravelBooking = async (req: Request, res: Response) =>  {
    try {
      const { id } = req.params;
      const deleteResult = await travelBookingRepository.delete(id);
      if (deleteResult.affected === 0) {
        return res.status(404).json({ message: "Travel Booking not found" });
      }
      return res.status(200).json({ message: "Travel Booking deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
