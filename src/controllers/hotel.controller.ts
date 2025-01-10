import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Hotel } from "../entity/hotel";
import { RoomType } from "../entity/roomType";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const hotelRepository = AppDataSource.getRepository(Hotel);
const roomTypeRepository = AppDataSource.getRepository(RoomType);


export const createHotel = async (req: Request, res: Response) => {
    try {
      const { hotel_name, destination_location_id, roomType = [] } = req.body;
  
      const existingHotel = await hotelRepository.findOne({
        where: {
          hotel_name : String(hotel_name),
          destination_location : {
            destinationLocation_id :  Number(destination_location_id),
          }
        },
      });
  
      if (existingHotel) {
        return res.status(400).json(
          CreateErrorResponse("Error", "A hotel with the same name already exists for this destination.", "Invalid")
        );
      }
  
      const hotel = hotelRepository.create(req.body);
      const result =  await hotelRepository.insert(hotel);

    if(roomType.length) {

      const roomTypeObj = [];

      roomType.map(async (room : Record<string,unknown>) => {

        const duplicate = await roomTypeRepository.findOne({
          where: { room_name : String(room.name), hotel: { hotel_id : result.identifiers[0].hotel_id  } },
        });
    
        if (duplicate) {
          return ;
        }
        roomTypeObj.push({ 
          room_name : room,
          hotel: { hotel_id : result.identifiers[0].hotel_id }})
      });

      await roomTypeRepository.insert(roomTypeObj);

    }

      return res.status(201).json(hotel);
    } catch (error) {
      const errorlog = {
        cameFrom: "createHotel",
        data: error,
        token: res?.locals?.token ?? null,
      };
      writeTableErrorLog(errorlog);
      return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
}

export const getHotels = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const [hotels, total] = await hotelRepository.findAndCount({
      relations: {
          destination_location : true,
          roomTypes :true
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    return res.status(200).json({ data: hotels, total });
  } catch (error) {
    const errorlog = {
            cameFrom: "getHotels",
            data: error,
            token: res?.locals?.token ?? null,
          };
          writeTableErrorLog(errorlog);
          return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
   }
  
}

export const updateHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { hotel_name, destination_location_id } = req.body;

    // Check for duplicates
    const existingHotel = await hotelRepository.findOne({
      where: {
        hotel_name,
        destination_location : {
          destinationLocation_id : Number(destination_location_id)
        },
      },
    });

    if (existingHotel && existingHotel.hotel_id !== Number(id)) {
      return res.status(400).json(
        CreateErrorResponse("Error", "A hotel with the same name already exists for this destination.", "Invalid")
      );
    }

    await hotelRepository.update(id, req.body);

    const updatedHotel = await hotelRepository.findOneBy({ hotel_id: Number(id) });
    return res.status(200).json(updatedHotel);
  } catch (error) {
    const errorlog = {
      cameFrom: "updateHotel",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
}

export const deleteHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await hotelRepository.delete(id);
    return res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteHotel",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
}

export const getHotel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hotel = await hotelRepository.findOne({
      relations: {
          destination_location : true,
          roomTypes : true
      },
      where :{
        hotel_id : Number(id),
        roomTypes : {
          status : 'active'
        }
      }
    });
    return res.status(200).json({ data: hotel || {} });
  } catch (error) {
    const errorlog = {
      cameFrom: "getHotel",
      data: error,
      token: res?.locals?.token ?? null,
    };
    writeTableErrorLog(errorlog);
    return res.status(500).json(CreateErrorResponse("Error", "Internal Server Error", "Something went wrong."));
}
}