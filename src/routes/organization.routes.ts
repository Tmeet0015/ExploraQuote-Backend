import express from 'express';
import { authMiddleware } from '../middleware/jwt';
import {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
  } from "../controllers/organization.controller";

const organizationRouter = express.Router();
  
  // Route to create a new organization
  organizationRouter.post("/",authMiddleware, createOrganization);
  
  // Route to get all organizations
  organizationRouter.get("/",authMiddleware, getOrganizations);
  
  // Route to get a specific organization by ID
  organizationRouter.get("/:id",authMiddleware, getOrganizationById);
  
  // Route to update an organization by ID
  organizationRouter.put("/:id",authMiddleware, updateOrganization);
  
  // Route to delete an organization by ID
  organizationRouter.delete("/:id",authMiddleware, deleteOrganization);
  

export default organizationRouter;
