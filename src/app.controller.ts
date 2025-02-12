import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import DAO from './shared/classes/dao';
import { HandleFileInterceptor } from './core/interceptors/handlefile.interceptor';
import Domain from './core/decorators/domain.decorator';
import { HandleMutiFileInterceptor } from './core/interceptors/handlemultifile.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Domain() domain:string) {
    return {message:'hello world',domain};
  }

  @Post()
  @UseInterceptors(
    new HandleFileInterceptor('file',{
    required:false
  }))
  getFormdata(@Body() body:any) {
    // console.log(body);
    
    return new DAO(['formdata'],body)
  }

  @Post('multi')
  @UseInterceptors(
    new HandleMutiFileInterceptor('files',{required:true})
  )
  getFormDatas(@Body() body:any) {
    
    return new DAO(['formdata'], body)
  }
}
