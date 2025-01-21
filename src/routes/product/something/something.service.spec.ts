import { Test, TestingModule } from '@nestjs/testing';
import { SomethingService } from './something.service';

describe('SomethingService', () => {
  let service: SomethingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SomethingService],
    }).compile();

    service = module.get<SomethingService>(SomethingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
