import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as entities from './entities';
import { ConfigService } from '@nestjs/config';
import { DOMAIN } from 'src/shared/enums/domain';

@Injectable()
export class DatabaseProvider {
  private domainToDataSource: Map<string, DataSource> = new Map();
  private isLocal:boolean
  private databaseUrl:string
  private readonly databaseConfigs:Array<{
    domain:DOMAIN,
    dbName:string
  }> = [
    {
      domain:DOMAIN.MIT,
      dbName: 'XXXXXXXXXX',
    }
  ]

  constructor(private readonly config:ConfigService) {
    this.isLocal = this.config.get<string>('NODE_ENV') ==='local'
    this.databaseUrl = this.config.get<string>('DATABASE_URL')
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
    const url = this.databaseUrl + (this.isLocal ? '/connect_db': this.databaseConfigs.find((d)=>d.domain === domain).dbName)

    // Create a new DataSource for this domain
    const newDataSource = new DataSource({
      type: 'postgres',
      url,
      entities: [...en],
      logging:this.isLocal,
    });
    

    // Initialize the DataSource
    await newDataSource.initialize();

    // Cache the initialized DataSource
    this.domainToDataSource.set(domain, newDataSource);

    return newDataSource;
  }
}
