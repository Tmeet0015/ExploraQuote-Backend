import express from 'express';
import { authMiddleware } from '../middleware/jwt';
import {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
  } from "../controllers/organization.controller";

const OrganizationRouter = express.Router();
  
  // Route to create a new organization
  OrganizationRouter.post("/",authMiddleware, createOrganization);
  
  // Route to get all organizations
  OrganizationRouter.get("/",authMiddleware, getOrganizations);
  
  // Route to get a specific organization by ID
  OrganizationRouter.get("/:id",authMiddleware, getOrganizationById);
  
  // Route to update an organization by ID
  OrganizationRouter.put("/:id",authMiddleware, updateOrganization);
  
  // Route to delete an organization by ID
  OrganizationRouter.delete("/:id",authMiddleware, deleteOrganization);
  

export default OrganizationRouter;
