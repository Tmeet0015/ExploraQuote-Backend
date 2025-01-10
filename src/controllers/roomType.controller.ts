import { Request, Response } from "express";
import { RoomType } from "../entity/roomType";
import { AppDataSource } from "../data-source";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const roomTypeRepository = AppDataSource.getRepository(RoomType);

// Create a new Room Type
export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { room_name, hotel } = req.body;

    const duplicate = await roomTypeRepository.findOne({
      where: { room_name, hotel: { hotel_id : Number(hotel) } },
    });

    if (duplicate) {
      return res.status(400).json(
        CreateErrorResponse(
          "Error",
          `Room type already exists for this hotel!`,
          "Invalid"
        )
      );
    }

    const roomType = roomTypeRepository.create(req.body);

    await roomTypeRepository.insert(roomType);
    return res.status(201).json(roomType);
  } catch (error) {
        const errorlog = {
          cameFrom: "createRoomType",
          data: error,
          token: res?.locals?.token == null ? null : res?.locals?.token,
        };
        writeTableErrorLog(errorlog);
        return res
          .status(500)
          .json(
            CreateErrorResponse(
              "Error",
              `Internal Server Error!`,
              "Something Went Wrong!!"
            )
          );
  }
};

// List all Room Types with pagination
export const getAllRoomTypes = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    const [roomTypes, count] = await roomTypeRepository.findAndCount({
      relations: {hotel :true},
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      where : {
        status : 'active'
      }
    });

    return res.status(200).json({ total: count, roomTypes });
  } catch (error) {
        const errorlog = {
      cameFrom: "getAllRoomTypes",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          `Internal Server Error!`,
          "Something Went Wrong!!"
        )
      );
  }
};

// Update a Room Type
export const updateRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await roomTypeRepository.update(id, req.body);
    const updatedRoomType = await roomTypeRepository.findOne({
      where: { room_type_id: parseInt(id) },
    });

    return res.status(200).json(updatedRoomType);
  } catch (error) {
        const errorlog = {
      cameFrom: "updateRoomType",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          `Internal Server Error!`,
          "Something Went Wrong!!"
        )
      );
  }
};

// Delete a Room Type
export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
 //   await roomTypeRepository.delete(id);
    await roomTypeRepository.update({room_type_id : Number(id)},{status : 'inactive'});
    return res.status(200).json({ message: "Room type deleted successfully" });
  } catch (error) {
        const errorlog = {
      cameFrom: "deleteRoomType",
      data: error,
      token: res?.locals?.token == null ? null : res?.locals?.token,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          `Internal Server Error!`,
          "Something Went Wrong!!"
        )
      );
  }
};
