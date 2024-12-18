import "reflect-metadata";
import { DataSource } from "typeorm";
import { logs_error } from "./entity/logs_error";
import { User } from "./entity/users";
import { Organization } from "./entity/organisation";
import { Destination } from "./entity/destination";
import { Location } from "./entity/location";
import { DestinationLocation } from "./entity/destinationLocation";
import { TravelMode } from "./entity/travelMode";

require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: true, // make it true to synchronize every Entity with our database
  logging: false, //to show execute query in console
  entities: [
    logs_error,
    User,
    Organization,
    Destination,
    Location,
    DestinationLocation,
    TravelMode
  ],
  migrations: [],
  subscribers: [],
});
