import { DataSource } from "typeorm";
import * as path from "path";

const db = new DataSource({
    url: 'postgres://postgres:password@localhost:5432/connect_db',
    type: 'postgres',
    // Dynamically resolve the entities path, assuming 'entities' is at the same level as 'datasource.ts'
    entities: [path.join(__dirname, 'entities', '*.ts')],  // Adjust this to your entities directory
    logging: true,
    migrations: ['migrations/*.ts']
});

export default db;
