import express from 'express';
import UserRouter from './User.routes';
import OrganizationRouter from './organization.routes';
import packagesRouter from './packages.routes';
import itineraryRouter from './itinerary.routes';
import clientRouter from './client.routes';
import destinationRoutes from './destination.routes';
import locationRoutes from './location.routes';
import destinationLocationRoutes from './destinationLocation.routes';


const mainRouter = express.Router();

mainRouter.use('/user', UserRouter);
mainRouter.use('/organization', OrganizationRouter);
mainRouter.use("/packages", packagesRouter);
mainRouter.use("/itineraries", itineraryRouter);
mainRouter.use("/client", clientRouter);
mainRouter.use("/destination", destinationRoutes);
mainRouter.use("/location", locationRoutes);
mainRouter.use("/destination-location", destinationLocationRoutes);
export default mainRouter;