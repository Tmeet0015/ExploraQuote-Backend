import { Request, Response } from "express";
import { ILike, Not } from "typeorm";
import { AppDataSource } from "../data-source";
import { Destination } from "../entity/destination";
import {
  CreateErrorResponse,
  CreateSuccessResponse,
} from "../helpers/responseHelper";
import { Location } from "../entity/location";
import { writeTableErrorLog } from "../helpers/error_log";
import { DestinationLocation } from "../entity/destinationLocation";

const DestinationRepository = AppDataSource.getRepository(Destination);
const LocationRepository = AppDataSource.getRepository(Location);
const DestinationLocationRepository =
  AppDataSource.getRepository(DestinationLocation);

//#region Destination

// Create Destination
export const createDestination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { destination_name, type, status } = req.body;

    if (!destination_name || !type || !status) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const existingDestination = await DestinationRepository.findOne({
      where: { destination_name },
    });

    if (existingDestination) {
      return res
        .status(400)
        .json(
          CreateErrorResponse(
            "Error",
            "Destination name already exists!",
            "Duplicate"
          )
        );
    }

    const newDestination = DestinationRepository.create(req.body);
    const result = await DestinationRepository.save(newDestination);

    return res
      .status(201)
      .json(CreateSuccessResponse("Destination created successfully!", result));
  } catch (error) {
    const errorlog = {
      cameFrom: "createDestination",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Read All Destination
export const getAllDestination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { page, limit, sortBy, order, type, status, search } = req.body;

    // Validation Checks
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "destination_id";
    order = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const allowedSortFields = [
      "destination_id",
      "destination_name",
      "created_at",
    ];
    const allowedStatuses = ["active", "inactive", "archived"];
    const allowedTypes = ["domestic", "international"];

    if (!allowedSortFields.includes(sortBy)) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid sortBy field!", "Invalid"));
    }

    if (status && !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json(
          CreateErrorResponse("Error", "Invalid status filter!", "Invalid")
        );
    }

    if (type && !allowedTypes.includes(type)) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid type filter!", "Invalid"));
    }

    // Query Building
    const whereConditions: Record<string, unknown> = {};
    if (type) whereConditions.type = type;
    if (status) whereConditions.status = status;
    if (search) {
      Object.assign(whereConditions, {
        destination_name: ILike(`%${search}%`),
      });
    }

    // Pagination and Sorting
    const [destinations, total] = await DestinationRepository.findAndCount({
      where: whereConditions,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (total === 0) {
      return res
        .status(404)
        .json(CreateErrorResponse("Error", "No data found!", "NotFound"));
    }

    return res.status(200).json(
      CreateSuccessResponse("Data retrieved successfully!", {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        destinations,
      })
    );
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllDestination",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Read One Destination
export const getOneDestination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid ID!", "Invalid"));
    }

    const destination = await DestinationRepository.findOne({
      where: { destination_id: parseInt(id) },
    });

    if (!destination) {
      return res
        .status(404)
        .json(
          CreateErrorResponse("Error", "Destination not found!", "Invalid")
        );
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Data retrieved successfully!", destination));
  } catch (error) {
    const errorlog = {
      cameFrom: "getOneDestination",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Update Destination
export const updateDestination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { destination_name, type, status } = req.body;

    if (!id || !destination_name || !type || !status) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const existingDestination = await DestinationRepository.findOne({
      where: {
        destination_name,
        destination_id: Not(Number(id)),
      },
    });

    if (existingDestination) {
      return res
        .status(400)
        .json(
          CreateErrorResponse(
            "Error",
            "Destination name already exists!",
            "Duplicate"
          )
        );
    }

    const updateResult = await DestinationRepository.update(id, req.body);

    if (updateResult.affected === 0) {
      return res
        .status(404)
        .json(
          CreateErrorResponse("Error", "Destination not found!", "NotFound")
        );
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Destination updated successfully!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "updateDestination",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Delete Destination
export const deleteDestination = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await DestinationRepository.delete({
      destination_id: parseInt(id),
    });

    if (result.affected === 0) {
      return res
        .status(404)
        .json(
          CreateErrorResponse("Error", "Destination not found!", "Invalid")
        );
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Destination deleted successfully!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteDestination",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

//#endregion Destination

//#region Location

export const createLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { location_name, latitude, longitude, destination_id } = req.body;

    if (!location_name || !latitude || !longitude || !destination_id) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const existingLocation = await LocationRepository.findOne({
      where: { location_name: String(location_name).trim(), status: "active" },
    });

    if (existingLocation) {
      return res
        .status(400)
        .json(
          CreateErrorResponse(
            "Error",
            "Location name already exists!",
            "Duplicate"
          )
        );
    }

    const locationBody = {
      destination_id,
      ...req.body,
    };

    const newLocation = LocationRepository.create(locationBody);
    const result = await LocationRepository.insert(newLocation);

    await DestinationLocationRepository.insert({
      destination: { destination_id: Number(destination_id) },
      location: { location_id: result.identifiers[0].location_id },
    });

    return res
      .status(201)
      .json(CreateSuccessResponse("Location created successfully!",{ location_id : result.identifiers[0].location_id}));
  } catch (error) {
    const errorlog = {
      cameFrom: "createLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Read All Location
export const getAllLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    let { page, limit, sortBy, order, status, search } = req.body;

    // Validation Checks
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy ?? "location_id";

    order = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const allowedSortFields = ["location_id", "location_name", "created_at"];
    const allowedStatuses = ["active", "inactive", "archived"];

    if (!allowedSortFields.includes(sortBy)) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid sortBy field!", "Invalid"));
    }

    if (status && !allowedStatuses.includes(status)) {
      return res
        .status(400)
        .json(
          CreateErrorResponse("Error", "Invalid status filter!", "Invalid")
        );
    }

    // Query Building
    const whereConditions: Record<string, unknown> = {};
    if (status) whereConditions.status = status;
    if (search) {
      Object.assign(whereConditions, {
        location_name: ILike(`%${search}%`),
      });
    }

    // Pagination and Sorting
    const [locations, total] = await LocationRepository.findAndCount({
      where: whereConditions,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (total === 0) {
      return res
        .status(404)
        .json(CreateErrorResponse("Error", "No data found!", "NotFound"));
    }

    return res.status(200).json(
      CreateSuccessResponse("Data retrieved successfully!", {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        locations,
      })
    );
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Read One Location
export const getOneLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid ID!", "Invalid"));
    }

    const destination = await DestinationRepository.findOne({
      where: { destination_id: parseInt(id) },
    });

    if (!destination) {
      return res
        .status(404)
        .json(
          CreateErrorResponse("Error", "Destination not found!", "Invalid")
        );
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Data retrieved successfully!", destination));
  } catch (error) {
    const errorlog = {
      cameFrom: "getOneLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Update Location
export const updateLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { location_name } = req.body;

    if (!id || !location_name) {
      return res
        .status(400)
        .json(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const existingLocation = await LocationRepository.findOne({
      where: {
        location_name,
        location_id: Not(Number(id)),
      },
    });

    if (existingLocation) {
      return res
        .status(400)
        .json(
          CreateErrorResponse(
            "Error",
            "Location name already exists!",
            "Duplicate"
          )
        );
    }

    const updateResult = await LocationRepository.update(id, req.body);

    if (updateResult.affected === 0) {
      return res
        .status(404)
        .json(CreateErrorResponse("Error", "Location not found!", "NotFound"));
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Location updated successfully!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "updateLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

// Delete Location
export const deleteLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const result = await LocationRepository.delete({
      location_id: parseInt(id),
    });

    if (result.affected === 0) {
      return res
        .status(404)
        .json(CreateErrorResponse("Error", "Location not found!", "Invalid"));
    }

    return res
      .status(200)
      .json(CreateSuccessResponse("Location deleted successfully!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
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

//#endregion Location

//#region DestinationLocation

// Get all destination locations
export const getAllDestinationLocations = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const destinationLocations = await DestinationLocationRepository.find({
      relations: {
        destination: true,
        location: true,
      },
      where: {
        status: "active",
        destination: {
          status: "active",
        },
        location: {
          status: "active",
        },
      },
    });
    return res
      .status(200)
      .send(
        CreateSuccessResponse(
          "Destination locations fetched successfully!",
          destinationLocations
        )
      );
  } catch (error) {
    const errorlog = {
      cameFrom: "getAllDestinationLocations",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error!",
          "Something went wrong"
        )
      );
  }
};

// Get a specific destination location by ID
export const getDestinationLocationById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const destinationLocation = await DestinationLocationRepository.findOne({
      where: { destinationLocation_id: parseInt(id) },
      relations: {
        destination: true,
        location: true,
      },
    });

    if (!destinationLocation) {
      return res
        .status(404)
        .send(
          CreateErrorResponse(
            "Error",
            "Destination-Location not found!",
            "Invalid"
          )
        );
    }

    return res
      .status(200)
      .send(
        CreateSuccessResponse(
          "Destination-Location found successfully!",
          destinationLocation
        )
      );
  } catch (error) {
    const errorlog = {
      cameFrom: "getDestinationLocationById",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error!",
          "Something went wrong"
        )
      );
  }
};

// Add a new destination location
export const addDestinationLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { destination_id, location_id } = req.body;

    // Validation: Check if the destination-location combination already exists
    const existingDestinationLocation =
      await DestinationLocationRepository.findOne({
        where: { destination: { destination_id }, location: { location_id } },
      });

    if (existingDestinationLocation) {
      return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "This destination-location combination already exists!",
            "Invalid"
          )
        );
    }

    // Save the new destination location
    await DestinationLocationRepository.save({
      destination: destination_id,
      location: location_id,
    });

    return res
      .status(201)
      .send(
        CreateSuccessResponse("Destination-Location created successfully!")
      );
  } catch (error) {
    const errorlog = {
      cameFrom: "addDestinationLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error!",
          "Something went wrong"
        )
      );
  }
};

// Update an existing destination location
export const updateDestinationLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { destination_id, location_id, status } = req.body;

    // Validation: Check if the destination-location combination already exists
    const existingDestinationLocation =
      await DestinationLocationRepository.findOne({
        where: {
          destination: { destination_id },
          location: { location_id },
          destinationLocation_id: Not(parseInt(id)),
        },
      });

    if (existingDestinationLocation) {
      return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "This destination-location combination already exists!",
            "Invalid"
          )
        );
    }

    const destinationLocation = await DestinationLocationRepository.findOne({
      where: { destinationLocation_id: parseInt(id) },
      relations: {
        destination: true,
        location: true,
      },
    });

    if (!destinationLocation) {
      return res
        .status(404)
        .send(
          CreateErrorResponse(
            "Error",
            "Destination Location not found!",
            "Invalid"
          )
        );
    }

    destinationLocation.destination =
      destination_id || destinationLocation.destination;
    destinationLocation.location = location_id || destinationLocation.location;
    destinationLocation.status = status || destinationLocation.status;

    await DestinationLocationRepository.save(destinationLocation);

    return res
      .status(200)
      .send(
        CreateSuccessResponse(
          "Destination Location updated successfully!",
          destinationLocation
        )
      );
  } catch (error) {
    const errorlog = {
      cameFrom: "updateDestinationLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error!",
          "Something went wrong"
        )
      );
  }
};

// Delete a destination location
export const deleteDestinationLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Invalid Payload!", "Invalid"));
    }

    const destinationLocation = await DestinationLocationRepository.findOne({
      where: { destinationLocation_id: parseInt(id) },
    });

    if (!destinationLocation) {
      return res
        .status(404)
        .send(
          CreateErrorResponse(
            "Error",
            "Destination Location not found!",
            "Invalid"
          )
        );
    }

    await DestinationLocationRepository.remove(destinationLocation);

    return res
      .status(200)
      .send(
        CreateSuccessResponse("Destination Location deleted successfully!")
      );
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteDestinationLocation",
      data: error,
      token: res?.locals?.token || null,
      body: req.body || null,
    };
    writeTableErrorLog(errorlog);
    return res
      .status(500)
      .json(
        CreateErrorResponse(
          "Error",
          "Internal Server Error!",
          "Something went wrong"
        )
      );
  }
};

//#endregion DestinationLocation
