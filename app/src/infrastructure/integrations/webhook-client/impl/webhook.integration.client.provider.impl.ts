import { WebhookIntegrationClientProvider } from '@core/providers/integrations';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IntegrationAuditCommon } from '@shared/audit/integrations';

@Injectable()
export class WebhookIntegrationClientProviderImpl implements WebhookIntegrationClientProvider {
  private readonly logger = new Logger(WebhookIntegrationClientProviderImpl.name);

  constructor(private readonly httpService: HttpService) {
    new IntegrationAuditCommon('webhook-notification', this.logger, httpService);
  }

  public async sendWebhook(endpoint: string, requestBody: any): Promise<void> {
    await firstValueFrom(this.httpService.post(endpoint, requestBody));
  }
}
