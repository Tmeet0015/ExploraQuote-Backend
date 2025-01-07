import { Request, Response } from "express";
import { CarDetails } from "../entity/cardDetail";
import { AppDataSource } from "../data-source";

const carDetailsRepository = AppDataSource.getRepository(CarDetails);

// Create Car Details
export const createCarDetails = async (req: Request, res: Response) => {
  try {
    const carDetails = carDetailsRepository.create(req.body);
    await carDetailsRepository.save(carDetails);
    return res.status(201).json(carDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get All Car Details
export const getAllCarDetails = async (req: Request, res: Response) => {
  try {
    const carDetails = await carDetailsRepository.find({
      relations: {travel_mode : true}
    });
    return res.status(200).json(carDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Car Details
export const updateCarDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await carDetailsRepository.update(id, req.body);
    const updatedDetails = await carDetailsRepository.findOne({ where: { car_id: parseInt(id) } });
    return res.status(200).json(updatedDetails);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Car Details
export const deleteCarDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await carDetailsRepository.delete(id);
    return res.status(200).json({ message: "Car details deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
