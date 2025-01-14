import { Module } from '@nestjs/common';
import { SomethingService } from './something.service';
import { SomethingController } from './something.controller';

@Module({
  controllers: [SomethingController],
  providers: [SomethingService],
})
export class SomethingModule {}
