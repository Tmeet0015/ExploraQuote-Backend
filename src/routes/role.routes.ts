import express from "express";
import { createRole, getRoles, updateRole, deleteRole, isAdmin} from "../controllers/role.controller";
import { authMiddleware } from "../middleware/jwt";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createRole); // Create Role
router.get("/", authMiddleware, isAdmin, getRoles); // Get All Roles
router.put("/:id", authMiddleware, isAdmin, updateRole); // Update Role
router.delete("/:id", authMiddleware, isAdmin, deleteRole); // Delete Role

export default router;
