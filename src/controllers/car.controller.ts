import { Request, Response } from "express";
import { CarDetails } from "../entity/cardDetail";
import { AppDataSource } from "../data-source";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const carDetailsRepository = AppDataSource.getRepository(CarDetails);

// Create Car Details
export const createCarDetails = async (req: Request, res: Response) => {
  try {
    const carDetails = carDetailsRepository.create(req.body);
    await carDetailsRepository.save(carDetails);
    return res.status(201).json(carDetails);
  } catch (error) {
    const errorlog = {
      cameFrom: "createCarDetails",
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

// Get All Car Details
export const getAllCarDetails = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const [carDetails, total] = await carDetailsRepository.findAndCount({
      relations: { travel_mode: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    return res.status(200).json({ data: carDetails, total, page, limit });
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllCarDetails",
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

// Update Car Details
export const updateCarDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await carDetailsRepository.update(
      {
        car_id: Number(id),
      },
      req.body
    );

    const updatedDetails = await carDetailsRepository.findOne({
      relations: { travel_mode: true },
      where: { car_id: Number(id) },
    });

    return res.status(200).json({ data: updatedDetails });
  } catch (error) {
    const errorlog = {
      cameFrom: "updateCarDetails",
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

// Delete Car Details
export const deleteCarDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await carDetailsRepository.delete(id);
    return res
      .status(200)
      .json({ message: "Car details deleted successfully" });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteCarDetails",
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
