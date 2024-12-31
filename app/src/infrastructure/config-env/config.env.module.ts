import { Module } from '@nestjs/common';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
import { ConfigModule } from '@nestjs/config';
import { DynamicConfigModule } from '@shared/config/abstract';

const dynamicModule = DynamicConfigModule.forFeature([ConfigEnvProviderImpl]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: dynamicModule.providers,
  exports: dynamicModule.exports,
})
export class ConfigEnvModule {}
