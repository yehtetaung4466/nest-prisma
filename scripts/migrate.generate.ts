import { config } from "dotenv";
import { generateMigrations } from "./utils";

config({path:'.env.prod'});
const databaseUrl = process.env.DATABASE_URL

generateMigrations(databaseUrl,'prod')
