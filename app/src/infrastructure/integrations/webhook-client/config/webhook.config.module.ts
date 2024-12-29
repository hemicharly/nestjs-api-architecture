import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { configEnv } from '@src/shared/config';

@Module({
  imports: [
    HttpModule.register({
      baseURL: configEnv.integrationsApi.webhook.baseUrl,
      timeout: 60 * 1000,
      maxRedirects: 5,
    }),
  ],
  exports: [HttpModule],
})
export class WebhookConfigModule {}
