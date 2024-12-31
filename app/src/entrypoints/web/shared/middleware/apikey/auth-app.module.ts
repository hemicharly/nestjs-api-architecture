import { Module } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config/abstract';

const dynamicProvider = [DynamicConfigModule.forProvider(CheckApiKeyUsecaseImpl, [ApiKeyApplicationRepositoryProviderImpl])];

@Module({
  imports: [RepositoryInfraModule],
  providers: dynamicProvider,
  exports: dynamicProvider,
})
export class AuthAppModule {}
