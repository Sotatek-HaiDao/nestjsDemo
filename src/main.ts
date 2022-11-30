import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.APP_PORT || 3000);
  console.log(`API is running at ${process.env.APP_PORT || 3000}`)
}
bootstrap();
