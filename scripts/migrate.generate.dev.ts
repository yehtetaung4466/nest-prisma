import { config } from "dotenv";
import { generateMigrations } from "./utils";

config();
const databaseUrl = process.env.DATABASE_URL

generateMigrations(databaseUrl,'dev')
