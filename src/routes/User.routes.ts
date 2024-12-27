import express from 'express';
import { authMiddleware } from '../middleware/jwt';
import {
    login,
    changePassword,
    getUserProfileData,
    editUserProfile,
    getUserProfileById,
    deleteUser,
  } from "../controllers/user.controller";

const UserRouter = express.Router();


// User & Admin Login
UserRouter.post("/login", login);

// Change Password
UserRouter.post("/change-password",authMiddleware, changePassword);

// Get Logged-in User Profile
UserRouter.get("/profile",authMiddleware, getUserProfileData);

// Edit Logged-in User Profile
UserRouter.put("/profile",authMiddleware, editUserProfile);

// Get a User Profile by ID
UserRouter.get("/:Id",authMiddleware, getUserProfileById);

// Delete a User
UserRouter.delete("/:Id",authMiddleware, deleteUser);

export default UserRouter;
