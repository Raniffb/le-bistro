import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200',
  });

  const config = new DocumentBuilder()
    .setTitle('Le Bistrô API')
    .setDescription('API do MVP de pedidos e estoque do restaurante')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  logger.log('Aplicação disponível em: http://localhost:3000');
  logger.log('Swagger disponível em: http://localhost:3000/docs');
}
void bootstrap();
