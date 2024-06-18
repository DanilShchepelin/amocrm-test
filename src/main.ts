import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const config = configService.get('app');
  await app.listen(config.port, () =>
    console.log(
      `Server started on port \x1b[36m${config.port}\x1b[0m\nMode is \x1b[33m${config.environment}\x1b[0m`,
    ),
  );
}
bootstrap();
