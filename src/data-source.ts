import "reflect-metadata";
import { DataSource } from "typeorm";
import { logs_error } from "./entity/logs_error";
import { User } from "./entity/users";
import { Organization } from "./entity/organisation";
import { Destination } from "./entity/destination";
import { Location } from "./entity/location";
import { DestinationLocation } from "./entity/destinationLocation";
import { TravelMode } from "./entity/travelMode";
import { Client } from "./entity/client";
import { Itinerary } from "./entity/itineraries";
import { Packages } from "./entity/packages";
import { FlightDetails } from "./entity/flightDetails";
import { Hotel } from "./entity/hotel";
import { TravelBooking } from "./entity/travelBooking";
import { PackageDestLocation } from "./entity/packageDestLocation";
import { RoomType } from "./entity/roomType";
import { TrainDetails } from "./entity/trainDetail";
import { CarDetails } from "./entity/cardDetail";

require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: false, // make it true to synchronize every Entity with our database
  logging: false, //to show execute query in console
  entities: [
    logs_error,
    User,
    Organization,
    Destination,
    Location,
    DestinationLocation,
    TravelMode,
    Packages,
    Client,
    Itinerary,
    FlightDetails,
    Hotel,
    TravelBooking,
    PackageDestLocation,
    RoomType,
    TrainDetails,
    CarDetails
  ],
  migrations: [],
  subscribers: [],
});
