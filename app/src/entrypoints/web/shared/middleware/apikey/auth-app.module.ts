import { Module } from '@nestjs/common';
import { RepositoryModule } from '@infrastructure/repositories';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config';

const dynamicProvider = [DynamicConfigModule.forProvider(CheckApiKeyUsecaseImpl, [ApiKeyApplicationRepositoryProviderImpl])];

@Module({
  imports: [RepositoryModule],
  providers: dynamicProvider,
  exports: dynamicProvider,
})
export class AuthAppModule {}
