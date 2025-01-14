import { Test, TestingModule } from '@nestjs/testing';
import { SomethingController } from './something.controller';
import { SomethingService } from './something.service';

describe('SomethingController', () => {
  let controller: SomethingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SomethingController],
      providers: [SomethingService],
    }).compile();

    controller = module.get<SomethingController>(SomethingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
