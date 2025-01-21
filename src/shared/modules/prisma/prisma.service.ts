import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService {
  private db: PrismaClient;
  private selectedDomain: string;
  
  private domainConfig = [
    {domain:'domain1',databaseUrl:'postgres://postgres:password@localhost:5432/connect_db'}
  ]

  private getConfig(domain: string): Prisma.PrismaClientOptions {
    const selectedDomain = this.domainConfig.find((d)=>d.domain===domain)
    if(!domain) throw new BadRequestException(['Domain not found'])
    return {
      log: ['query'], // Adjust logging levels as needed
      datasources: {
        db: {
          url: selectedDomain.databaseUrl, // Use the passed database URL
        },
      },
    };
  }

  buildDb(domain:string): PrismaClient {
    if (this.db && this.selectedDomain ===domain) {
      console.log('Database already exists');
      return this.db;
    }

    console.log('Creating new database connection');
    this.db = new PrismaClient(this.getConfig(domain)); // No spread operator needed
    return this.db;
  }
}
