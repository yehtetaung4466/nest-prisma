import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { S3Module } from './shared/modules/s3/s3.module';
import { SomethingModule } from './something/something.module';

@Module({
  imports: [ProductModule, PrismaModule, S3Module, SomethingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
