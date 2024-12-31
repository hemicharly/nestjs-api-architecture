import { Module, Provider } from '@nestjs/common';
import { RepositoryInfraModule } from '@infrastructure/repositories';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { UsecaseProviderConfig } from '@shared/config/abstract';

const usecaseProvidersConfig: Provider[] = [UsecaseProviderConfig(CheckApiKeyUsecaseImpl, [ApiKeyApplicationRepositoryProviderImpl])];

@Module({
  imports: [RepositoryInfraModule],
  providers: usecaseProvidersConfig,
  exports: usecaseProvidersConfig,
})
export class AuthAppModule {}
