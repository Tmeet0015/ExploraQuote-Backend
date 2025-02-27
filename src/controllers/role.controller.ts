import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/role";
import { writeTableErrorLog } from "../helpers/error_log";
import { CreateErrorResponse, CreateSuccessResponse } from "../helpers/responseHelper";
import { User } from "../entity/users";


const RoleRepository = AppDataSource.getRepository(Role);
const UserRepository = AppDataSource.getRepository(User);

export const isAdmin = async (_req: Request, res: Response, next: Function) => {
    const userId = res.locals?.id; 
    const user = await UserRepository.findOneBy({ id: userId });
  
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
    }
    next();
  };

// Create a Role
export const createRole = async (req: Request, res: Response) => {
  try {
    const { role_name } = req.body;

    const existingRole = await RoleRepository.findOneBy({ role_name });
    if (existingRole) {
        return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "Role name already exists",
            "Invalid"
          )
        );
    }

    const newRole = RoleRepository.create({ role_name });
    await RoleRepository.save(newRole);

    return res
        .status(201)
        .send(CreateSuccessResponse(`Role created successfully!`, {role: newRole}));
  } catch (error) {
     const errorlog = {
          cameFrom: "createRole",
          data: error,
          token: null,
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

// Get All Roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await RoleRepository.find({order : {role_name : "ASC"}});
    return res
    .status(200)
    .send(CreateSuccessResponse(`Role created successfully!`, {roles: roles}));
  } catch (error) {
    const errorlog = {
        cameFrom: "getRoles",
        data: error,
        token: null,
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

// Update Role
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role_name } = req.body;

    const role = await RoleRepository.findOneBy({ id: Number(id) });
    if (!role) {
        return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "Role name already exists",
            "Invalid"
          )
        );
    }

    role.role_name = role_name || role.role_name;

    await RoleRepository.save(role);
    return res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    const errorlog = {
        cameFrom: "updateRole",
        data: error,
        token: null,
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

// Delete Role
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const roleRepository = AppDataSource.getRepository(Role);

    const role = await roleRepository.findOneBy({ id: Number(id) });
    if (!role) {
        return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "Role name not found",
            "Invalid"
          )
        );
    }

    await roleRepository.remove(role);
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    const errorlog = {
        cameFrom: "deleteRole",
        data: error,
        token: null,
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
