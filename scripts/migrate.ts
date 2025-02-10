import { config } from "dotenv";
import { runMigrations } from "./utils";

config({path:'.env.prod'});
const databaseUrl = process.env.DATABASE_URL

runMigrations(databaseUrl,'prod')
