import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as entities from './entities';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseProvider {
  private domainToDataSource: Map<string, DataSource> = new Map();
  private isLocal:boolean

  constructor(private readonly config:ConfigService) {
    this.isLocal = this.config.get<string>('isLocal') ==='local'
  }

  async build(domain: string): Promise<DataSource> {
    // Check if the DataSource for this domain is already initialized
    if (this.domainToDataSource.has(domain)) {
      const existingDataSource = this.domainToDataSource.get(domain);
      if (existingDataSource?.isInitialized) {
        return existingDataSource;
      }
    }


    const en = Object.values(entities);
    const url = this.config.get<string>('DATABASE_URL') + '/connect_db'

    // Create a new DataSource for this domain
    const newDataSource = new DataSource({
      type: 'postgres',
      // url: `postgres://postgres:password@postgres:5432/connect_db`, // Adjust as needed
      url,
      entities: [...en],
    //   synchronize: false, // Use migrations in production instead of auto-sync
      logging:this.isLocal,
    });
    

    // Initialize the DataSource
    await newDataSource.initialize();

    // Cache the initialized DataSource
    this.domainToDataSource.set(domain, newDataSource);

    return newDataSource;
  }
}
