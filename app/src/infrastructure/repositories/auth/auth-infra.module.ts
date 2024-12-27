import { Module } from '@nestjs/common';
import { ApiKeyApplication } from '@infrastructure/repositories/auth/entity';
import { ApiKeyApplicationSeed } from '@infrastructure/repositories/auth/seeds';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { RepositoryConfigModule } from '@infrastructure/repositories/abstract/repository.config.module';

const commonRepositoryModule = RepositoryConfigModule.forFeature([ApiKeyApplication], ApiKeyApplicationRepositoryProviderImpl);

@Module({
  imports: commonRepositoryModule.imports,
  providers: [ApiKeyApplicationSeed, ...commonRepositoryModule.providers],
  exports: [...commonRepositoryModule.exports, ApiKeyApplicationSeed],
})
export class AuthInfraModule {}
