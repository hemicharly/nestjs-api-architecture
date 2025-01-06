import { WebhookIntegrationClientProviderInterface } from '@core/providers/integrations';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { IntegrationInterceptor } from '@shared/config/integrations';

@Injectable()
export class WebhookIntegrationClientProviderImpl
  implements WebhookIntegrationClientProviderInterface
{
  private readonly logger = new Logger(WebhookIntegrationClientProviderImpl.name);

  constructor(private readonly httpService: HttpService) {
    new IntegrationInterceptor('webhook-notification', this.logger, httpService);
  }

  public async sendWebhook(endpoint: string, requestBody: Record<string, any>): Promise<void> {
    await firstValueFrom(this.httpService.post(endpoint, requestBody));
  }
}
