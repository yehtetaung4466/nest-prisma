import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dto';
import DAO from 'src/shared/classes/dao';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}


  @Post()
  createAttendance(@Body() body:AttendanceDto) {
    return new DAO(['attendance'],body)
  }
}
