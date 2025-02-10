import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./core/database/database.module";
import { S3Module } from "./core/s3/s3.module";
import { ConfigModule } from "@nestjs/config";
import { AttendanceModule } from './modules/attendance/attendance.module';

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule, // Eagerly loaded (global)
    S3Module, // Eagerly loaded (global),
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}