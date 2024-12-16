import express from 'express';
import UserRouter from './User.router';


const mainRouter = express.Router();

mainRouter.use('/api/user', UserRouter);


export default mainRouter;