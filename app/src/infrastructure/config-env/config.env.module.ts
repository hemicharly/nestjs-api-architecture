import { Module } from '@nestjs/common';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigModule } from '@nestjs/config';
import { DynamicConfigModule } from '@shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  ...DynamicConfigModule.forProviderRegister([{ useClass: ConfigEnvProviderImpl }]),
})
export class ConfigEnvModule {}
