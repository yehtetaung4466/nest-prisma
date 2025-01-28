import { exec } from "child_process";
import path from "path";

// Set the environment variable and define command details
const databaseUrl = "postgres://postgres:password@localhost:5432/connect_db";
const migrationDir = path.join(__dirname, "../migrations/dev/dev");  // Ensure path is correct
const dataSourcePath = path.join(__dirname, "../src/core/database/datasource.ts");

// TypeORM CLI command for generating migrations
const command = `DATABASE_URL=${databaseUrl} ts-node ./node_modules/typeorm/cli.js migration:generate -p ${migrationDir} -d ${dataSourcePath}`;

// Run the command using the Node.js child_process module
exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error executing migration: ${error.message}`);
//     process.exit(1);
//   }

  if (stderr) {
    console.error(`TypeORM CLI stderr: ${stderr}`);
    process.exit(1);
  }

  console.log("Migration generated successfully:");
  console.log(stdout);
});
