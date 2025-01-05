import { Module } from '@nestjs/common';
import { ApiKeyApplication } from '@infrastructure/repositories/auth/entity';
import { ApiKeyApplicationSeed } from '@infrastructure/repositories/auth/seeds';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyApplication])],
  ...DynamicConfigModule.forProviderRegister([
    { useClass: ApiKeyApplicationSeed },
    { useClass: ApiKeyApplicationRepositoryProviderImpl }
  ])
})
export class AuthRepositoryModule {}
