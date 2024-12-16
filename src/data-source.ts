import "reflect-metadata";
import { DataSource } from "typeorm";
import { logs_error } from "./entity/logs_error";
import { User } from "./entity/users";
import { Organization } from "./entity/organisation";

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
    Organization
  ],
  migrations: [],
  subscribers: [],
});
