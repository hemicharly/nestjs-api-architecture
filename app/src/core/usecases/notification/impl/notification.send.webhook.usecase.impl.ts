import { NotificationSendWebhookUsecase } from '@core/usecases/notification/notification.send.webhook.usecase';
import { WebhookIntegrationClientProvider } from '@core/providers/integrations';

export class NotificationSendWebhookUsecaseImpl implements NotificationSendWebhookUsecase {
  constructor(private readonly webhookIntegrationClientProvider: WebhookIntegrationClientProvider) {}

  public async execute(message: string): Promise<void> {
    const requestBody: any = JSON.parse(message);
    await this.webhookIntegrationClientProvider.sendWebhook('/', requestBody);
  }
}
