import { NestFactory } from '@nestjs/core';
import { ApiKeyApplicationSeed } from '@infrastructure/repositories/auth/seeds/api-key-application.seed';
import { SeedModule } from '@src/seed.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeedModule);
  await app.get(ApiKeyApplicationSeed).seed();
  await app.close();
}

bootstrap().catch((err) => console.error(err));
