import express from 'express';
import { authMiddleware } from '../middleware/jwt';
import { login, getUserProfileById } from '../controllers/user.controller';


const UserRouter = express.Router();

UserRouter.post('/login', login);
UserRouter.get('/get-user-profile-by-Id/:Id', authMiddleware, getUserProfileById);



export default UserRouter;
