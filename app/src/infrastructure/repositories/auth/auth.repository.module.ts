import { Module } from '@nestjs/common';
import { ApiKeyApplication } from '@infrastructure/repositories/auth/entity';
import { ApiKeyApplicationSeed } from '@infrastructure/repositories/auth/seeds';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config';
import { TypeOrmModule } from '@nestjs/typeorm';

const dynamicFeature = DynamicConfigModule.forFeature([ApiKeyApplicationRepositoryProviderImpl]);

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyApplication])],
  providers: [ApiKeyApplicationSeed, ...dynamicFeature.providers],
  exports: [ApiKeyApplicationSeed, ...dynamicFeature.exports],
})
export class AuthRepositoryModule {}
