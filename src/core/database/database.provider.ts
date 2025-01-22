import { Injectable} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import * as models from 'src/core/database/models';

@Injectable()
export class DatabaseProvider{
    private domain?: string;
    private db?: Sequelize;

    build(domain: string) {

        if(domain === this.domain && this.db) return this.db;
        // Extract models from the `models` object
        const modelList = Object.values(models);

        this.db = new Sequelize('postgres://postgres:password@localhost:5432/connect_db', {
            models: modelList, // Pass the array of models here
        });
        return this.db
    }
}
