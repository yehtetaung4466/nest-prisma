import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { S3Module } from './core/s3/s3.module';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),ProductModule,S3Module, DatabaseModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
