import { Request, Response } from "express";
import { TrainDetails } from "../entity/trainDetail";
import { AppDataSource } from "../data-source";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const trainDetailsRepository = AppDataSource.getRepository(TrainDetails);

// Create Train Details
export const createTrainDetails = async (req: Request, res: Response) => {
  try {
    const trainDetails = trainDetailsRepository.create(req.body);
    await trainDetailsRepository.save(trainDetails);
    return res.status(201).json(trainDetails);
  } catch (error) {
    const errorlog = {
                cameFrom: "createTrainDetails",
                data: error,
                token: res?.locals?.token ?? null,
              };
              writeTableErrorLog(errorlog);
              return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

// Get All Train Details
export const getAllTrainDetails = async (req: Request, res: Response) => {
  try {
    const trainDetails = await trainDetailsRepository.find({
      relations: {travel_mode : true}
    });
    return res.status(200).json(trainDetails);
  } catch (error) {
    const errorlog = {
            cameFrom: "getAllTrainDetails",
            data: error,
            token: res?.locals?.token ?? null,
          };
          writeTableErrorLog(errorlog);
          return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

// Update Train Details
export const updateTrainDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await trainDetailsRepository.update(id, req.body);
    const updatedDetails = await trainDetailsRepository.findOne({ where: { train_id: parseInt(id) } });
    return res.status(200).json(updatedDetails);
  } catch (error) {
    const errorlog = {
            cameFrom: "updateTrainDetails",
            data: error,
            token: res?.locals?.token ?? null,
          };
          writeTableErrorLog(errorlog);
          return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

// Delete Train Details
export const deleteTrainDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await trainDetailsRepository.delete(id);
    return res.status(200).json({ message: "Train details deleted successfully" });
  } catch (error) {
    const errorlog = {
            cameFrom: "deleteTrainDetails",
            data: error,
            token: res?.locals?.token ?? null,
          };
          writeTableErrorLog(errorlog);
          return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};
