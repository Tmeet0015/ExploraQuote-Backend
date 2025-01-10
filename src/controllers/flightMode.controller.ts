import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";
import { FlightDetails } from "../entity/flightDetails";

const flightDetailsRepository = AppDataSource.getRepository(FlightDetails);


export const createFlightDetails = async (req: Request, res: Response) => {
    try {
      const { flight_no, travel_mode_id, flight_departure, flight_arrival } = req.body;
  
      // Prevent duplicate entries
      const existingFlight = await flightDetailsRepository.findOne({
        where: { flight_no, travel_mode : {
            travel_mode_id : Number(travel_mode_id)
        }, flight_departure, flight_arrival },
      });
  
      if (existingFlight) {
        return res.status(400).json({ error: "Duplicate entry. Flight details already exist." });
      }
  
      const flightDetails = flightDetailsRepository.create(req.body);
      await flightDetailsRepository.save(flightDetails);
  
      return res.status(201).json(flightDetails);
    } catch (error) {
      const errorlog = {
        cameFrom: "createFlightDetails",
        data: error,
        token: res?.locals?.token ?? null,
      };
      writeTableErrorLog(errorlog);
      return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
    }
  };

export const getAllFlightDetails = async (req: Request, res: Response) => {
try {
    const { page = 1, limit = 10 } = req.query;

    const [flights, total] = await flightDetailsRepository.findAndCount({
      relations: {travel_mode : true},
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      order: { created_at: "DESC" },
    });

    return res.status(200).json({data : flights,  total, page, limit});

} catch (error) {
    const errorlog = {
    cameFrom: "getAllFlightDetails",
    data: error,
    token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
};

export const updateFlightDetails = async (req: Request, res: Response) => {
try {
    const { id } = req.params;
    // const { flight_no, travel_mode, flight_departure, flight_arrival } = req.body;

    // Prevent duplicate entries
    // const duplicateCheck = await flightDetailsRepository.findOne({
    // where: { 
    //   flight_no,  
    //   travel_mode : {
    //     travel_mode_id : Number(travel_mode)
    //   }, 
    //  flight_departure,
    //  flight_arrival },
    // });

    // if (duplicateCheck && duplicateCheck.flight_id !== parseInt(id)) {
    // return res.status(400).json({ error: "Duplicate entry. Flight details already exist." });
    // }

    await flightDetailsRepository.update({
      flight_id : Number(id)
    },
    req.body
  );

  const updatedDetails = await flightDetailsRepository.findOne({ 
    relations : {travel_mode : true},
    where: { flight_id: Number(id) }
    });     

  return res.status(200).json({data : updatedDetails});
} catch (error) {
    const errorlog = {
    cameFrom: "updateFlightDetails",
    data: error,
    token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
};
  
export const deleteFlightDetails = async (req: Request, res: Response) => {
try {
    const { id } = req.params;
    const flightDetails = await flightDetailsRepository.findOneBy({ flight_id: parseInt(id) });

    if (!flightDetails) {
    return res.status(404).json(CreateErrorResponse("Error", "Not Found", "Flight details not found."));
    }

    await flightDetailsRepository.delete(id);
    return res.status(200).json({ message: "Flight details deleted successfully." });
} catch (error) {
    const errorlog = {
    cameFrom: "deleteFlightDetails",
    data: error,
    token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
};