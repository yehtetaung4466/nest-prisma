import fs from 'fs';
import path from 'path';


const migrationsDir = process.cwd() + '/prisma/migrations'


// Patterns to look for in SQL files
const dangerousPatterns = [
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /DELETE\s+FROM\s+[^;]*;$/i, // DELETE without WHERE
  /UPDATE\s+[^\s]+\s+SET\s+[^;]*;$/i, // UPDATE without WHERE
];

function validateMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const migrationFolders = fs.readdirSync(migrationsDir);

  for (const folder of migrationFolders) {
    const migrationPath = path.join(migrationsDir, folder, 'migration.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationContent = fs.readFileSync(migrationPath, 'utf8');

      dangerousPatterns.forEach((pattern) => {
        const match = migrationContent.match(pattern);
        if (match) {
          console.error(
            `Potentially dangerous SQL detected in migration '${folder}':\n"${match[0]}"`
          );
          process.exit(1);
        }
      });
    }
  }

  console.log('All migrations validated successfully. No dangerous SQL detected.');
}

validateMigrationFiles();
