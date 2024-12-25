import { Router } from "express";
import { authMiddleware } from "../middleware/jwt";
import { createClient, getClients, getClientById, updateClient, deleteClient } from "../controllers/clients.controller";

const clientRouter = Router();

clientRouter.post("/", authMiddleware, createClient);  // Create a new client
clientRouter.get("/", authMiddleware, getClients);    // List all clients with pagination
clientRouter.get("/:id", authMiddleware, getClientById); // Get a client by ID
clientRouter.put("/:id", authMiddleware, updateClient);  // Update client details
clientRouter.delete("/:id", authMiddleware, deleteClient); // Delete a client


export default clientRouter;
