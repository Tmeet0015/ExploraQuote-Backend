import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Hotel } from "../entity/hotel";

const hotelRepository = AppDataSource.getRepository(Hotel);

export const createHotel = async (req: Request, res: Response) => {
    try {
      const { hotel_name, destination_location_id } = req.body;
  
      const existingHotel = await hotelRepository.findOne({
        where: {
          hotel_name : String(hotel_name),
          destination_location : {
            destinationLocation_id :  Number(destination_location_id),
          }
        },
      });
  
      if (existingHotel) {
        return res.status(400).json({ error: "A hotel with the same name already exists for this destination." });
      }
  
      const hotel = hotelRepository.create(req.body);
      await hotelRepository.save(hotel);
  
      return res.status(201).json(hotel);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  

  export const getHotels = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const [hotels, total] = await hotelRepository.findAndCount({
        relations: {
            destination_location : true
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });
      return res.status(200).json({ data: hotels, total });
    } catch (error) {
      return res.status(400).json({ error: error.message });
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
        return res.status(400).json({ error: "A hotel with the same name already exists for this destination." });
      }
  
      await hotelRepository.update(id, req.body);
  
      const updatedHotel = await hotelRepository.findOneBy({ hotel_id: Number(id) });
      return res.status(200).json(updatedHotel);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  export const deleteHotel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await hotelRepository.delete(id);
      return res.status(200).json({ message: "Hotel deleted successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
}
