import { DataSource } from "typeorm";
import * as path from "path";




const url = process.env.DATABASE_URL;
if(!url) {
    throw new Error("DATABASE_URL is not set");
}

// if(migrations.length === 0) {
//     throw new Error("MIGRATION_DIR is not set");
// }
// console.log(process.env.MIGRATION_DIR);

const db = new DataSource({
    url,
    type: 'postgres',
    // Dynamically resolve the entities path, assuming 'entities' is at the same level as 'datasource.ts'
    entities: [path.join(__dirname, 'entities', '*.ts')],  // Adjust this to your entities directory
    logging: true,
    // migrations: ['migrations/*.ts']
    migrations:[process.env.MIGRATION_DIR || 'migrations/dev/*.ts'],
});

export default db;
