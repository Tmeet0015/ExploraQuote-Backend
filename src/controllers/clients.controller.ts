import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Client } from "../entity/client";
import { CreateErrorResponse } from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";

const clientRepository = AppDataSource.getRepository(Client);

export const createClient = async (req: Request, res: Response) => {
  try {
    const clientData = clientRepository.create(req.body); // Create an entity instance
    const savedClient = await clientRepository.save(clientData); // Save to the database
    res.status(201).json(savedClient);
  } catch (error) {
    const errorlog = {
      cameFrom: "createClient",
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

export const getClients = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;

    const [clients, total] = await clientRepository.findAndCount({
      where: { ...filters }, // Apply filters dynamically
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.status(200).json({ data: clients, total, page, limit });
  } catch (error) {
    const errorlog = {
      cameFrom: "getClients",
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

export const getClientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const clientData = await clientRepository.findOneBy({
      client_id: Number(id),
    });

    if (!clientData) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(clientData);
  } catch (error) {
    const errorlog = {
      cameFrom: "getClientById",
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

export const updateClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await clientRepository.update(id, req.body); // Update client
    const updatedClient = await clientRepository.findOneBy({
      client_id: Number(id),
    });

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (error) {
    const errorlog = {
      cameFrom: "updateClient",
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

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteResult = await clientRepository.delete(id);

    if (!deleteResult.affected) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    const errorlog = {
      cameFrom: "deleteClient",
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
