import { Inject, Injectable } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { NotificationSendWebhookUsecase } from '@core/usecases/notification';
import { SqsMessageHandler } from '@shared/config/sqs/decorators';

@Injectable()
export class NotificationOrderConsumerService {
  @Inject(NotificationSendWebhookUsecaseImpl.name)
  private readonly notificationSendWebhookUsecase: NotificationSendWebhookUsecase;

  @SqsMessageHandler({ queueNameEnv: 'QUEUE_NOTIFICATION_ORDER', waitTimeSeconds: 5, batchSize: 10 })
  async handleMessage(message: Message) {
    await this.notificationSendWebhookUsecase.execute(message.Body);
  }
}
