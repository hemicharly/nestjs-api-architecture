import { Module } from '@nestjs/common';
import { CheckApiKeyUsecaseImpl } from '@core/usecases/auth/impl';
import { ApiKeyApplicationRepositoryProviderImpl } from '@infrastructure/repositories/auth/impl';
import { DynamicConfigModule } from '@shared/config';
import { InfrastructureModule } from '@src/infrastructure';

@Module({
  imports: [InfrastructureModule],
  ...DynamicConfigModule.forProviderRegister([
    {
      useClass: CheckApiKeyUsecaseImpl,
      injects: [ApiKeyApplicationRepositoryProviderImpl],
    },
  ]),
})
export class AuthAppModule {}
