import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './routes/product/product.module';
import { S3Module } from './shared/modules/s3/s3.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';

@Module({
  imports: [ProductModule,S3Module,PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
