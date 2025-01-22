import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GeneralErrorException, GeneralHttpException } from "./core/exceptions";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api')
  app.enableCors()
  app.useGlobalFilters(
    new GeneralErrorException(),
    new GeneralHttpException(),
  );
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));
  await app.listen(3000,'0.0.0.0');
}
bootstrap()