import { Module } from '@nestjs/common';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigModule } from '@nestjs/config';
import { DynamicConfigModule } from '@shared/config/abstract';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
    }),
  ],
  ...DynamicConfigModule.forFeature([ConfigEnvProviderImpl]),
})
export class ConfigEnvModule {}
