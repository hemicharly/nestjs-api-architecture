import { Inject, Injectable, Logger } from '@nestjs/common';
import { configEnv } from '@src/shared/config';
import { Message } from '@aws-sdk/client-sqs';
import { NotificationSendWebhookUsecaseImpl } from '@core/usecases/notification/impl';
import { NotificationSendWebhookUsecase } from '@core/usecases/notification';
import { SqsMessageHandler } from '@infrastructure/queue/sqs/config/decorators';

@Injectable()
export class NotificationOrderConsumerService {
  private readonly logger = new Logger(NotificationOrderConsumerService.name);

  @Inject(NotificationSendWebhookUsecaseImpl.name)
  private readonly notificationSendWebhookUsecase: NotificationSendWebhookUsecase;

  @SqsMessageHandler({ queueName: configEnv.aws.sqs.queueNames.queueNotificationOrder, waitTimeSeconds: 5, batchSize: 10 })
  async handleMessage(message: Message) {
    if (!message || !message.Body) {
      this.logger.warn(`[QueueName: ${configEnv.aws.sqs.queueNames.queueNotificationOrder}] Empty message body received in queue.`);
      return;
    }
    await this.notificationSendWebhookUsecase.execute(message.Body);
  }
}
