import { Request, Response } from "express";
import { TrainDetails } from "../entity/trainDetail";
import { AppDataSource } from "../data-source";

const trainDetailsRepository = AppDataSource.getRepository(TrainDetails);

// Create Train Details
export const createTrainDetails = async (req: Request, res: Response) => {
  try {
    const trainDetails = trainDetailsRepository.create(req.body);
    await trainDetailsRepository.save(trainDetails);
    return res.status(201).json(trainDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
  }
};

// Delete Train Details
export const deleteTrainDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await trainDetailsRepository.delete(id);
    return res.status(200).json({ message: "Train details deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
