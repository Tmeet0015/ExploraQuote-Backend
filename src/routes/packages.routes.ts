import { Router } from "express";
import { createPackage, deletePackage, getPackageById, getPackages, updatePackage } from "../controllers/packages.controller";
import { authMiddleware } from "../middleware/jwt";

const packagesRouter = Router();

// Route to create a package
packagesRouter.post("/", authMiddleware, createPackage);

// Route to get all packages with filters and pagination
packagesRouter.get("/", authMiddleware, getPackages);

// Route to get a single package by ID
packagesRouter.get("/:id", authMiddleware, getPackageById);

// Route to update a package
packagesRouter.put("/:id", authMiddleware, updatePackage);

// Route to delete a package
packagesRouter.delete("/:id", authMiddleware, deletePackage);

export default packagesRouter;
