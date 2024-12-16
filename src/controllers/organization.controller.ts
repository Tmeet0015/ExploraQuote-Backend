// src/controllers/organization.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Organization } from "../entity/organisation";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse } from "../helpers/responseHelper";

const OrganizationRepository = AppDataSource.getRepository(Organization);

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const organization = OrganizationRepository.create(req.body);
    const result = await OrganizationRepository.save(organization);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    const errorlog = {
         cameFrom: "createOrganization",
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

export const getOrganizations = async (_req: Request, res: Response) => {
  try {
    const organizations = await OrganizationRepository.find();
    return res.status(200).json({ success: true, data: organizations });
  } catch (error) {
    const errorlog = {
        cameFrom: "getOrganizations",
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

export const getOrganizationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationRepository.findOne({
      where: { brand_id: parseInt(id) },
    });

    if (!organization) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    return res.status(200).json({ success: true, data: organization });
  } catch (error) {
    const errorlog = {
        cameFrom: "getOrganizationById",
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

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationRepository.findOne({
      where: { brand_id: parseInt(id) },
    });

    if (!organization) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const updatedData = OrganizationRepository.merge(organization, req.body);
    const result = await OrganizationRepository.save(updatedData);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    const errorlog = {
        cameFrom: "updateOrganization",
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

export const deleteOrganization = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await OrganizationRepository.delete(id);

    if (result.affected === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Organization not found" });
      }

    return res
      .status(200)
      .json({ success: true, message: "Organization deleted successfully" });
  } catch (error) {
    const errorlog = {
        cameFrom: "deleteOrganization",
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
