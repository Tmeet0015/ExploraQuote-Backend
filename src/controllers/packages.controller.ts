import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Packages } from "../entity/packages";
import { PackageDestLocation } from "../entity/packageDestLocation";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";
import { removeUndefinedValues } from "../helpers/common"

  const packageRepository = AppDataSource.getRepository(Packages);
  const packageDestLocationRepository = AppDataSource.getRepository(PackageDestLocation);

  export const createPackage = async (req: Request, res: Response) => {
    try {

      const {DestinationLocationIds = [], ...restReqBody} = req.body;

      if(DestinationLocationIds.length === 0){
        return res.status(400).json(
          CreateErrorResponse("Error", "Destination Detail Required!", "Invalid")
        );
      }

      const packageData = packageRepository.create(restReqBody); 
      const savedPackage = await packageRepository.insert(packageData);

      const newMappings = DestinationLocationIds.map((item: number) => ({
        destination_location: { destinationLocation_id: Number(item) },
        package: { package_id: savedPackage.identifiers[0].package_id },
      }));
    
      await packageDestLocationRepository.insert(newMappings);

      res.status(201).send(CreateSuccessResponse(`Saved Successfully.`));
    } catch (error) {
      const errorlog = {
        cameFrom: "createPackage",
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
  }

  export const getPackages = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;

      const [packages, total] = await packageRepository.findAndCount({
        relations : { package_dest_location : {
          destination_location : {
             location : true,
             destination : true
          }
          
        } }, 
        where: { ...filters, is_active : true},
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      });

      res.status(200).json({ data: packages, total, page, limit });
    } catch (error) {
      const errorlog = {
        cameFrom: "getPackages",
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
  }

  export const getPackageById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const packageData = await packageRepository.findOneBy({ package_id: Number(id), is_active : true });

      if (!packageData) {
        return res.status(404).json(  CreateErrorResponse(
          "Error",
          `Package not found`,
          "Invalid"
        ));
      }

      res.status(200).json(packageData);
    } catch (error) {
      const errorlog = {
        cameFrom: "getPackageById",
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
  }

  export const updatePackage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {DestinationLocationIds = [], ...restReqBody} = req.body;
      const updatedPackage = await packageRepository.findOneBy({ package_id: Number(id) });

      if (!updatedPackage) {
        return res.status(409).json(CreateErrorResponse(
          "Error",
          `Package not found`,
          "Invalid"
        ));
      }

      await packageRepository.update(id, removeUndefinedValues(restReqBody));

      if (Array.isArray(DestinationLocationIds) && DestinationLocationIds.length > 0) {
        await packageDestLocationRepository.delete({ package: { package_id: Number(id) } });
      
        const newMappings = DestinationLocationIds.map(item => ({
          destination_location: { destinationLocation_id: Number(item) },
          package: { package_id: Number(id) },
        }));
      
        await packageDestLocationRepository.insert(newMappings);
      }
      

      res.status(200).json(CreateSuccessResponse(`Updated Successfully.`));
    } catch (error) {
      const errorlog = {
        cameFrom: "updatePackage",
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
  }

  export const deletePackage = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleteResult = await packageRepository.update(id,{is_active : false});

      if (!deleteResult.affected) {
        return res.status(409).json(
          CreateErrorResponse(
            "Error",
            `Package not found`,
            "Invalid"
          )
          );
      }

      res.status(200).send(CreateSuccessResponse(`Deleted Successfully.`));
    } catch (error) {
      const errorlog = {
        cameFrom: "deletePackage",
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
  }
