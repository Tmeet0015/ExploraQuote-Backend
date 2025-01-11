import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Itinerary } from "../entity/itineraries";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const itineraryRepository = AppDataSource.getRepository(Itinerary);

export const createItinerary = async (req: Request, res: Response) => {
  try {
    const itineraryData = itineraryRepository.create(req.body);
    const savedItinerary = await itineraryRepository.save(itineraryData);
    res.status(201).json(savedItinerary);
  } catch (error) {
    const errorlog = {
      cameFrom: "createItinerary",
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

export const getItineraries = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const [itineraries, total] = await itineraryRepository.findAndCount({
      relations : {
        packages : true,
        hotel: true,
        travel_mode : true
      },
      where: { ...filters }, // Apply filters dynamically
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.status(200).json({ data: itineraries, total, page, limit });
  } catch (error) {
    const errorlog = {
      cameFrom: "getItineraries",
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

export const getItineraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const itineraryData = await itineraryRepository.findOneBy({
      itinerary_id: Number(id),
    });

    if (!itineraryData) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(itineraryData);
  } catch (error) {
    const errorlog = {
      cameFrom: "getItineraryById",
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

export const updateItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await itineraryRepository.update(id, req.body); // Update itinerary
    const updatedItinerary = await itineraryRepository.findOneBy({
      itinerary_id: Number(id),
    });

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json(updatedItinerary);
  } catch (error) {
    const errorlog = {
      cameFrom: "updateItinerary",
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

export const deleteItinerary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteResult = await itineraryRepository.delete(id);

    if (!deleteResult.affected) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteItinerary",
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
