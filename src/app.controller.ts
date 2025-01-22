import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import DAO from './shared/classes/dao';
import { HandleFileInterceptor } from './core/interceptors/handlefile.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {message:'hello world'};
  }

  @Post()
  @UseInterceptors(new HandleFileInterceptor('file',{
    required:false
  }))
  getFormdata(@Body() body:any) {
    return new DAO(['formdata',body])
  }
}
