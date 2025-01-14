import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
{
  private db: PrismaClient;
  private domain:string;

  buildDb(databaseUrl: string): PrismaClient {
    if(this.db) {
      console.log('database already exit');
      
      return this.db
    };
    console.log('created new database');
    
    this.db = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl, // Use the passed database URL
          
        },
      },
    });
    return this.db;
  }
}
