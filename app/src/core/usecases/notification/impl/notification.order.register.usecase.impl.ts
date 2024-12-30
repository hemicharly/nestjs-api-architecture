import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { ProducerQueueProvider } from '@core/providers/queue';
import { configEnv } from '@shared/config';

export class NotificationOrderRegisterUsecaseImpl implements NotificationOrderRegisterUsecase {
  constructor(private readonly sendQueueProvider: ProducerQueueProvider) {}
  public async execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void> {
    await this.sendQueueProvider.sendMessage(configEnv.aws.sqs.queues.queueNotificationOrder, JSON.stringify(notificationOrderCoreEntity));
  }
}
