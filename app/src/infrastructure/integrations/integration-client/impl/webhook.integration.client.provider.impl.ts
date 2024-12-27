import { WebhookIntegrationClientProvider } from '@core/providers/integrations';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WebhookIntegrationClientProviderImpl implements WebhookIntegrationClientProvider {
  private readonly logger = new Logger(WebhookIntegrationClientProviderImpl.name);

  constructor(private readonly httpService: HttpService) {}

  public async sendWebhook(endpoint: string, requestBody: any): Promise<void> {
    try {
      const response = await firstValueFrom(this.httpService.post(endpoint, requestBody));
      this.logger.log('Webhook sent with success:', response.data);
    } catch (e) {
      this.logger.error(`[Endpoint: ${endpoint}] Failed to send webhook.`, e.stack);
      throw e;
    }
  }
}
