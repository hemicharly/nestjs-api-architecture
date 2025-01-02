import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigEnvProvider } from '@core/providers/config-env';
import { ConfigEnvModule } from '@infrastructure/config-env';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigEnvModule],
      useFactory: async (configEnvProvider: ConfigEnvProvider) => ({
        baseURL: configEnvProvider.getString('WEBHOOK_BASE_URL'),
        timeout: 60 * 1000,
        maxRedirects: 5,
      }),
      inject: [ConfigEnvProviderImpl],
    }),
  ],
  exports: [HttpModule],
})
export class WebhookConfigModule {}
