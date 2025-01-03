import { NotificationSendWebhookUsecaseInterface } from '@core/usecases/notification/notification.send.webhook.usecase.interface';
import { WebhookIntegrationClientProviderInterface } from '@core/providers/integrations';

export class NotificationSendWebhookUsecaseImpl implements NotificationSendWebhookUsecaseInterface {
  constructor(private readonly webhookIntegrationClientProvider: WebhookIntegrationClientProviderInterface) {}

  public async execute(message: string): Promise<void> {
    const requestBody: any = JSON.parse(message);
    await this.webhookIntegrationClientProvider.sendWebhook('/', requestBody);
  }
}
