import { Module } from '@nestjs/common';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config';
import { InfrastructureModule } from '@src/infrastructure';

const dynamicProvider = [DynamicConfigModule.forProvider(CheckApiKeyUsecaseImpl, [ApiKeyApplicationRepositoryProviderImpl])];

@Module({
  imports: [InfrastructureModule],
  providers: dynamicProvider,
  exports: dynamicProvider,
})
export class AuthAppModule {}
