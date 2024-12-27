import { NotificationOrderCoreEntity } from 'src/core/domain/entities/notifications';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { ProducerQueueProvider } from '@core/providers/queue/producer.queue.provider';
import { configEnv } from '@src/config.env';

export class NotificationOrderRegisterUsecaseImpl implements NotificationOrderRegisterUsecase {
  constructor(private readonly sendQueueProvider: ProducerQueueProvider) {}
  public async execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void> {
    await this.sendQueueProvider.sendMessage(configEnv.aws.sqs.queues.queueNotificationOrder, JSON.stringify(notificationOrderCoreEntity));
  }
}
