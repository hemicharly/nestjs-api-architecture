import { Module, Provider } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { UsecaseProviderConfig } from '@entrypoints/config/usecases/abstract';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';

const usecaseProvidersConfig: Provider[] = [UsecaseProviderConfig(CheckApiKeyUsecaseImpl, [ApiKeyApplicationRepositoryProviderImpl])];

@Module({
  imports: [RepositoryInfraModule],
  providers: usecaseProvidersConfig,
  exports: usecaseProvidersConfig,
})
export class AuthAppModule {}
