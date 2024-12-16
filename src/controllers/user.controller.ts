import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  CreateErrorResponse,
  CreateSuccessResponse,
} from "../helpers/responseHelper";
import { writeTableErrorLog } from "../helpers/error_log";
import { AppDataSource } from "../data-source";
import { User, Role } from "../entity/users";
import process from "process";
import { Not } from "typeorm";


const UserRepository = AppDataSource.getRepository(User);

// User & Admin Login
export const login = async (req: Request, res: Response): Promise<any> =>  {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Invalid Payload!", `Invalid`));
    }

    let data: any;
  
      const newUserData = await UserRepository.findOne({
        where: {
          email: email,
          is_active: false,
        },
      });

      if (newUserData) {
        const validUser = bcrypt.compareSync(password, newUserData.password);

        if (!validUser) {
          return res
            .status(400)
            .send(
              CreateErrorResponse(
                "Error",
                "Login failed!! Please enter correct email and password",
                "Invalid"
              )
            );
        }

        const token = jwt.sign(
          {
            id: newUserData.id?.toString(),
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "2 days",
          }
        );

        newUserData["token"] = token;
        delete newUserData["password"];

        if (validUser) {
          if (newUserData.is_active == false) {
            return res
              .status(400)
              .send(
                CreateErrorResponse(
                  "Error",
                  `Account does not exists!`,
                  "Invalid"
                )
              );
          }

          data = newUserData;
        }
      } else {
        return res
          .status(400)
          .send(
            CreateErrorResponse(
              "Error",
              "Login failed!! Please enter correct password and email",
              "Invalid"
            )
          );
      }
  
    return res
      .status(200)
      .send(CreateSuccessResponse(`Welcome to Explore Tours & Travels!`, data));
  } catch (error) {
    const errorlog = {
      cameFrom: "login",
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

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const token = res.locals.token;
    const token_data: any = jwt.decode(token);
    const { current_pass, new_pass } = req.body;

    if (!current_pass || !new_pass) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", `Invalid Payload!`, "Invalid"));
    }

    const user_obj = await UserRepository.findOne({
      where: { id: parseInt(token_data.id) },
    });

    if (!bcrypt.compareSync(current_pass, user_obj.password)) {
      return res
        .status(400)
        .send(
          CreateErrorResponse("Error", `Old password is invalid!`, "Invalid")
        );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(new_pass, salt);
    await UserRepository.save({ id: user_obj.id, password: hashedPwd });

    return res
      .status(200)
      .send(CreateSuccessResponse("Successfully changed the password!"));
  } catch (error) {
    const errorlog = {
      cameFrom: "changePassword",
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

//Get Logged in User Profile
export const getUserProfileData = async (req: Request, res: Response) => {
  try {
    const token = res.locals.token;
    const token_data: any = jwt.decode(token);

    const user = await UserRepository.findOne({
      relations: {
      },
      where: { id: parseInt(token_data.id) },
    });

    return res
      .status(200)
      .send(CreateSuccessResponse("Data found successfully!", user));
  } catch (error) {
    const errorlog = {
      cameFrom: "getUserProfileData",
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

//Edit Logged in User Profile
export const editUserProfile = async (req: Request, res: Response) => {
  try {
    const token = res.locals.token;
    const token_data: any = jwt.decode(token);
    const { first_name, last_name, email, phone } = req.body;

    const is_exist = await UserRepository.findOne({
      where: {
        id: Not(parseInt(token_data.id)),
        email: email,
      },
    });

    if (is_exist) {
      return res
        .status(400)
        .send(
          CreateErrorResponse(
            "Error",
            "This email is already exist!",
            `Invalid`
          )
        );
    }

    let user: User;

    let user_req = {
      id: parseInt(token_data.id),
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
    };

    user = await UserRepository.save(user_req);

    return res
      .status(200)
      .send(CreateSuccessResponse("Profile updated successfully!", user));
  } catch (error) {
    const errorlog = {
      cameFrom: "editUserProfile",
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

//Get a user data by Id
export const getUserProfileById = async (req: Request, res: Response) => {
  try {
    const { Id } = req.params;
    if (Id == undefined || Number.isNaN(Number(Id))) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Invalid Payload!", `Invalid`));
    }

    let user = await UserRepository.findOne({
      where: {
        id: parseInt(Id),
        is_active: true,
      },
    });

    if (user == null) {
      user = await UserRepository.findOne({
        where: { id: parseInt(Id), is_active: true },
      });
    }

    if (user) {
      return res
        .status(200)
        .send(CreateSuccessResponse("Data found successfully!", user));
    } else {
      return res
        .status(200)
        .send(CreateSuccessResponse("No data found!", user));
    }
  } catch (error) {
    const errorlog = {
      cameFrom: "getUserProfileById",
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

//Delete a user data for team setting
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { Id } = req.params;

    if (!Id || Number.isNaN(Number(Id))) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Invalid Payload!", `Invalid`));
    }

    let user_obj = await UserRepository.findOne({
      where: { id: parseInt(Id) },
    });

    if (user_obj == null) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "No User found!", `Invalid`));
    }

    if (user_obj.role == Role.Admin) {
      return res
        .status(400)
        .send(CreateErrorResponse("Error", "Admin Can not delete!", `Invalid`));
    }

    //await UserRepository.delete({ id: parseInt(Id) });
    await UserRepository.save({ id: parseInt(Id), is_active: false, updated_at: new Date(), deleted_at: new Date() });

    return res
      .status(200)
      .send(CreateSuccessResponse("User deleted successfully!"));
  } catch (error) {
    writeTableErrorLog({
      cameFrom: "deleteUser",
      data: error,
      token: null,
    });

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
