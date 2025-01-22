import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './routes/product/product.module';
import { S3Module } from './core/modules/s3/s3.module';
import { DatabaseModule } from './core/database/database.module';
@Module({
  imports: [ProductModule,S3Module, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
