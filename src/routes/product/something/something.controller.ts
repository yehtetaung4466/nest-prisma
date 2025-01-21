import { Controller } from '@nestjs/common';
import { SomethingService } from './something.service';

@Controller('something')
export class SomethingController {
  constructor(private readonly somethingService: SomethingService) {}
}
