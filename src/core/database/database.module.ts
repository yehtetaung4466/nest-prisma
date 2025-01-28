import { Global, Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { ConfigService } from '@nestjs/config';
@Global()
@Module({
    providers:[DatabaseProvider,ConfigService],
    exports:[DatabaseProvider]
})
export class DatabaseModule {}
