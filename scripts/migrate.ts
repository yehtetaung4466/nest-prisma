import { exec } from "child_process";

// List of database URLs
const databaseUrls = [
  "your_database_url_1",
  "your_database_url_2",
  "your_database_url_3"
];

// Function to execute the migration command for each database
function runMigration(databaseUrl:string) {
  return new Promise((resolve, reject) => {
    console.log(`Migrating database with URL: ${databaseUrl}...`);
    exec(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing migration for ${databaseUrl}: ${stderr}`);
      } else {
        resolve(`Migration successful for ${databaseUrl}: ${stdout}`);
      }
    });
  });
}

// Main migration function that runs migrations for all databases
async function migrate() {
  const migrationPromises = databaseUrls.map(databaseUrl => runMigration(databaseUrl));

  try {
    // Wait for all migrations to complete concurrently
    const results = await Promise.allSettled(migrationPromises);

    // Log results of each migration attempt
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        console.log(result.value);
      } else {
        console.error(result.reason);
      }
    });
  } catch (error) {
    // If any migration fails, you can log it, but it won't stop the others
    console.error(`Migration process encountered an error: ${error}`);
  }
}

// Start the migration process
migrate();
