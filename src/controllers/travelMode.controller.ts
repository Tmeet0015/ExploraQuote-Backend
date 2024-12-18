import { Request, Response } from "express";
import { TravelMode } from "../entity/travelMode";
import { AppDataSource } from "../data-source";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";

const TravelModeRepository = AppDataSource.getRepository(TravelMode);

// Get all travel modes
export const getAllTravelModes = async (req: Request, res: Response): Promise<any> => {
  try {
    const travelModes = await TravelModeRepository.find();
    return res.status(200).send(CreateSuccessResponse("Travel modes fetched successfully!", travelModes));
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllTravelModes",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error!", "Something went wrong"));
  }
};

// Get a specific travel mode by ID
export const getTravelModeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).send(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const travelMode = await TravelModeRepository.findOne({ where: { travel_mode_id: parseInt(id) } });
    
    if (!travelMode) {
      return res.status(404).send(CreateErrorResponse("Error", "Travel Mode not found!", "Invalid"));
    }

    return res.status(200).send(CreateSuccessResponse("Travel Mode found successfully!", travelMode));
  } catch (error) {
    const errorlog = {
      cameFrom: "getTravelModeById",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error!", "Something went wrong"));
  }
};

// Add a new travel mode
export const addTravelMode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { Name, Travel_date, FlightNo, TrainNo, Pickup_date, Pickup_Address } = req.body;

    const existingTravelMode = await TravelModeRepository.findOne({
      where: [{ name : Name }, { flight_no : FlightNo }, { train_no: TrainNo }],
    });

    if (existingTravelMode) {
      return res.status(400).send(CreateErrorResponse("Error", "Duplicate entry found!", "Invalid"));
    }

    const travelMode = new TravelMode();
    travelMode.name = Name;
    travelMode.travel_date = new Date(Travel_date);
    travelMode.flight_no = FlightNo;
    travelMode.train_no = TrainNo;
    travelMode.pickup_date = Pickup_date ? new Date(Pickup_date) : null;
    travelMode.pickup_address = Pickup_Address;

    // Save the new travel mode
    await TravelModeRepository.save(travelMode);

    return res.status(201).send(CreateSuccessResponse("Travel Mode created successfully!", travelMode));
  } catch (error) {
    const errorlog = {
      cameFrom: "addTravelMode",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error!", "Something went wrong"));
  }
};

// Update an existing travel mode
export const updateTravelMode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { Name, Travel_date, FlightNo, TrainNo, Pickup_date, Pickup_Address } = req.body;

    const existingTravelMode = await TravelModeRepository.findOne({
      where: [{ name :Name }, { flight_no : FlightNo }, { train_no : TrainNo }],
    });

    if (existingTravelMode) {
      return res.status(400).send(CreateErrorResponse("Error", "Duplicate entry found!", "Invalid"));
    }

    const travelMode = await TravelModeRepository.findOne({ where: { travel_mode_id: parseInt(id) } });

    if (!travelMode) {
      return res.status(404).send(CreateErrorResponse("Error", "Travel Mode not found!", "Invalid"));
    }

    travelMode.name = Name || travelMode.name;
    travelMode.travel_date = Travel_date ? new Date(Travel_date) : travelMode.travel_date;
    travelMode.flight_no = FlightNo || travelMode.flight_no;
    travelMode.train_no = TrainNo || travelMode.train_no;
    travelMode.pickup_date = Pickup_date ? new Date(Pickup_date) : travelMode.pickup_date;
    travelMode.pickup_address = Pickup_Address || travelMode.pickup_address;

    await TravelModeRepository.save(travelMode);

    return res.status(200).send(CreateSuccessResponse("Travel Mode updated successfully!", travelMode));
  } catch (error) {
    const errorlog = {
      cameFrom: "updateTravelMode",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error!", "Something went wrong"));
  }
};

// Delete a travel mode
export const deleteTravelMode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).send(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const travelMode = await TravelModeRepository.findOne({ where: { travel_mode_id: parseInt(id) } });

    if (!travelMode) {
      return res.status(404).send(CreateErrorResponse("Error", "Travel Mode not found!", "Invalid"));
    }

    await TravelModeRepository.remove(travelMode);

    return res.status(200).send(CreateSuccessResponse("Travel Mode deleted successfully!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteTravelMode",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error!", "Something went wrong"));
  }
};
