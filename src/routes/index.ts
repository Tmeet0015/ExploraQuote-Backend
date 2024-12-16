import express from 'express';
import UserRouter from './User.router';
import OrganizationRouter from './Organization.router';


const mainRouter = express.Router();

mainRouter.use('/api/user', UserRouter);
mainRouter.use('/api/organization', OrganizationRouter);


export default mainRouter;