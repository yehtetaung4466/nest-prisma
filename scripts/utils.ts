import { exec } from "child_process";
import path from "path";
import dbConfig from "../src/config/db.config";

export function generateMigrations(databaseUrl:string,type:'prod'|'dev') {

    const dataSourcePath = path.join(__dirname, "../src/core/database/datasource.ts");

const generate = ({ domain, dbName }) => {
  return new Promise((resolve, reject) => {
    const migrationDir = path.join(__dirname, `../migrations/${type}/${domain.toLowerCase()}/${domain.toLowerCase()}`);
    const dbUrl = `${databaseUrl}/${dbName}`;
    const command = `DATABASE_URL="${dbUrl}" npx ts-node ./node_modules/typeorm/cli.js migration:generate ${migrationDir} -d ${dataSourcePath}`;

    console.log(`Running: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing migration for ${dbName}: ${error.message}`);
        reject({ dbName, error: error.message });
      } else if (stderr) {
        console.error(`TypeORM CLI stderr for ${dbName}: ${stderr}`);
        reject({ dbName, error: stderr });
      } else {
        console.log(`Migration generated successfully for ${dbName}:`);
        console.log(stdout);
        resolve({ dbName, success: true });
      }
    });
  });
};

const migrationPromises = dbConfig.map(config => generate(config));

Promise.allSettled(migrationPromises)
  .then(results => {
    results.forEach((result, index) => {
      const { dbName } = dbConfig[index];
      if (result.status === 'fulfilled') {
        console.log(`Success: Migration for ${dbName} completed successfully.`);
      } else {
        console.error(`Failure: Migration for ${dbName} failed with error: ${result.reason.error}`);
      }
    });
  });
}


export function runMigrations(databaseUrl:string,type:'prod' | 'dev') {
 const dataSourcePath = path.join(__dirname, "../src/core/database/datasource.ts");

// Function to run migrations for a single database
const runMigrationsOps = ({ domain, dbName }) => {
  return new Promise((resolve, reject) => {
    const dbUrl = `${databaseUrl}/${dbName}`;
    const migrationDir = `migrations/dev/${domain.toLowerCase()}/*.ts`; // Custom migration directory per domain
    const command = `DATABASE_URL=${dbUrl} MIGRATION_DIR=${migrationDir} ts-node ./node_modules/typeorm/cli.js migration:run -d ${dataSourcePath}`;

    console.log(`Running migrations for database: ${dbName}`);
    console.log(`Command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running migrations for ${dbName}: ${error.message}`);
        reject({ dbName, error: error.message });
      } else if (stderr) {
        console.error(`TypeORM CLI stderr for ${dbName}: ${stderr}`);
        reject({ dbName, error: stderr });
      } else {
        console.log(`Migrations ran successfully for ${dbName}:`);
        console.log(stdout);
        resolve({ dbName, success: true });
      }
    });
  });
};

// Run migrations for all databases concurrently
const migrationPromises = dbConfig.map(config => runMigrationsOps(config));

Promise.allSettled(migrationPromises)
  .then(results => {
    results.forEach((result, index) => {
      const { dbName } = dbConfig[index];
      if (result.status === "fulfilled") {
        console.log(`Success: Migrations for ${dbName} completed successfully.`);
      } else {
        console.error(`Failure: Migrations for ${dbName} failed with error: ${result.reason.error}`);
      }
    });
  });
}