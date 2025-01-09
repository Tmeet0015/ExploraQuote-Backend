import { Request, Response } from "express";
import { TravelMode } from "../entity/travelMode";
import { AppDataSource } from "../data-source";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";

const travelModeRepository = AppDataSource.getRepository(TravelMode);

export const createTravelMode = async (req: Request, res: Response) => {
  try {

    let existingTravelIndexNo = await travelModeRepository.find({
      select : {trave_index_no : true},
      order : {trave_index_no : 'DESC'},
      take : 1
    });
    Object.assign(req.body,{
      trave_index_no : (existingTravelIndexNo.length > 0 && existingTravelIndexNo[0].trave_index_no  ? Number(existingTravelIndexNo[0].trave_index_no) + 1 :  1)
    })

    const travelMode = travelModeRepository.create(req.body);

    const insertedTravelModeId = (await travelModeRepository.insert(travelMode)).identifiers[0].travel_mode_id;

    let result = await travelModeRepository.findOne({
      where :{trave_index_no : insertedTravelModeId }
    });

    return res.status(201).send(CreateSuccessResponse(`Added Successfully!`,result));
  } catch (error) {
    const errorlog = {
      cameFrom: "createTravelMode",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

export const getAllTravelModes = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const [travelModes, total] = await travelModeRepository.findAndCount({
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      order: { created_at: "DESC" },
    });

    return res.status(200)
    .json({ data: travelModes, total, page: parseInt(page as string), limit: parseInt(limit as string) });
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllTravelModes",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

export const updateTravelMode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, travel_start_date, travel_end_date } = req.body;

    // Prevent duplicate entries
    const duplicateCheck = await travelModeRepository.findOne({
      where: { name, travel_start_date, travel_end_date },
    });

    if (duplicateCheck && duplicateCheck.travel_mode_id !== parseInt(id)) {
      return res.status(400).json({ error: "Duplicate entry. A travel mode with the same name and dates already exists." });
    }

    await travelModeRepository.update(id, req.body);

    const updatedTravelMode = await travelModeRepository.findOneBy({ travel_mode_id: parseInt(id) });
    if (!updatedTravelMode) {
      return res.status(404).json(CreateErrorResponse("Error", "Not Found", "Travel mode not found."));
    }

    return res.status(200).json(updatedTravelMode);
  } catch (error) {
    const errorlog = {
      cameFrom: "updateTravelMode",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};

export const deleteTravelMode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const travelMode = await travelModeRepository.findOneBy({ travel_mode_id: parseInt(id) });

    if (!travelMode) {
      return res.status(404).json(CreateErrorResponse("Error", "Not Found", "Travel mode not found."));
    }

    await travelModeRepository.delete(id);
    return res.status(200).json({ message: "Travel mode deleted successfully." });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteTravelMode",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
  }
};