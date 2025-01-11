import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TravelBooking } from "../entity/travelBooking";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const travelBookingRepository = AppDataSource.getRepository(TravelBooking);

// Create a Travel Booking
export const createTravelBooking = async (req: Request, res: Response) => {
  try {
    const travelBooking = travelBookingRepository.create(req.body);
    await travelBookingRepository.save(travelBooking);
    return res.status(201).json(travelBooking);
  } catch (error) {
    const errorlog = {
      cameFrom: "createTravelBooking",
      data: error,
      token: res?.locals?.token ?? null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error",
          "Something went wrong."
        )
      );
  }
};

// List all Travel Bookings with Pagination and Relations
export const getTravelBookings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [travelBookings, total] = await travelBookingRepository.findAndCount({
      relations: {
        travel_mode: true,
      },

      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    return res.status(200).json({ data: travelBookings, total });
  } catch (error) {
    const errorlog = {
      cameFrom: "getTravelBookings",
      data: error,
      token: res?.locals?.token ?? null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error",
          "Something went wrong."
        )
      );
  }
};

// Update a Travel Booking
export const updateTravelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await travelBookingRepository.update(id, req.body);
    const updatedBooking = await travelBookingRepository.findOne({
      where: { travel_mode_booking_id: parseInt(id) },
      relations: {
        travel_mode: true,
      },
    });
    if (!updatedBooking) {
      return res.status(404).json({ message: "Travel Booking not found" });
    }
    return res.status(200).json(updatedBooking);
  } catch (error) {
    const errorlog = {
      cameFrom: "updateTravelBooking",
      data: error,
      token: res?.locals?.token ?? null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error",
          "Something went wrong."
        )
      );
  }
};

// Delete a Travel Booking
export const deleteTravelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteResult = await travelBookingRepository.delete(id);
    if (deleteResult.affected === 0) {
      return res.status(404).json({ message: "Travel Booking not found" });
    }
    return res
      .status(200)
      .json({ message: "Travel Booking deleted successfully" });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteTravelBooking",
      data: error,
      token: res?.locals?.token ?? null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error",
          "Something went wrong."
        )
      );
  }
};
