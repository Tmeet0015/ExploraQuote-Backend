import express from 'express';
import UserRouter from './User.routes';
import OrganizationRouter from './Organization.routes';
import packagesRouter from './packages.routes';
import itineraryRouter from './itinerary.routes';
import clientRouter from './client.routes';


const mainRouter = express.Router();

mainRouter.use('/api/user', UserRouter);
mainRouter.use('/api/organization', OrganizationRouter);
mainRouter.use("/packages", packagesRouter);
mainRouter.use("/itineraries", itineraryRouter);
mainRouter.use("/client", clientRouter);
export default mainRouter;