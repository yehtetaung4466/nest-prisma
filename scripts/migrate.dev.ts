import { config } from "dotenv";
import { runMigrations } from "./utils";

config();
const databaseUrl = process.env.DATABASE_URL

runMigrations(databaseUrl,'dev')
