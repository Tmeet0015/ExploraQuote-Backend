import express from 'express';
import UserRouter from './User.routes';
import OrganizationRouter from './organization.routes';
import packagesRouter from './packages.routes';
import itineraryRouter from './itinerary.routes';
import clientRouter from './client.routes';
import destinationRoutes from './destination.routes';
import locationRoutes from './location.routes';
import destinationLocationRoutes from './destinationLocation.routes';
import hotelRoutes from './hotel.routes';
import travelBookingsRoutes from './travel-booking.routes';
import flightModeRoutes from './flightMode.routes';
import travelModeRoutes from './travel-mode.routes';


const mainRouter = express.Router();

mainRouter.use('/user', UserRouter);
mainRouter.use('/organization', OrganizationRouter);
mainRouter.use("/packages", packagesRouter);
mainRouter.use("/itineraries", itineraryRouter);
mainRouter.use("/client", clientRouter);
mainRouter.use("/destination", destinationRoutes);
mainRouter.use("/location", locationRoutes);
mainRouter.use("/destination-location", destinationLocationRoutes);
mainRouter.use("/hotels", hotelRoutes);
mainRouter.use("/travel-bookings", travelBookingsRoutes);
mainRouter.use("/flight-details", flightModeRoutes);
mainRouter.use("/travel-mode", travelModeRoutes);

export default mainRouter;