// src/controllers/organization.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Organization } from "../entity/organisation";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { removeUndefinedValues } from "../helpers/common";

const OrganizationRepository = AppDataSource.getRepository(Organization);

export const createOrganization = async (req: Request, res: Response) => {
  try {
     await OrganizationRepository.insert(removeUndefinedValues(req.body));
    return res.status(201)
    .send(CreateSuccessResponse(`Added SuccessFully!`));
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
    return res.status(200)
    .send(CreateSuccessResponse(`Fetch SuccessFully!`, organizations));
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
      where: { organisation_id: parseInt(id) },
    });

    if (!organization) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    return res.status(200)
    .send(CreateSuccessResponse(`Fetch SuccessFully!`,organization));
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
      where: { organisation_id: parseInt(id) },
    });

    if (!organization) {
      return res
        .status(404)
        .json({ success: false, message: "Organization not found" });
    }

    const updatedData = OrganizationRepository.merge(organization, req.body);
    const result = await OrganizationRepository.save(updatedData);

    return res.status(200)
    .send(CreateSuccessResponse(`Saved!`,result));
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
      .send(CreateSuccessResponse(`Deleted SuccessFully!`));
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
