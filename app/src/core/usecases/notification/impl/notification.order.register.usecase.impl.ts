import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';
import { NotificationOrderRegisterUsecase } from '@core/usecases/notification';
import { ProducerQueueProvider } from '@core/providers/queue';
import { ConfigEnvProvider } from '@core/providers/config-env';

export class NotificationOrderRegisterUsecaseImpl implements NotificationOrderRegisterUsecase {
  constructor(
    private readonly sendQueueProvider: ProducerQueueProvider,
    private readonly configEnvProvider: ConfigEnvProvider,
  ) {}
  public async execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void> {
    const queueName = this.configEnvProvider.getString('QUEUE_NOTIFICATION_ORDER', 'queue_notification_order');
    await this.sendQueueProvider.sendMessage(queueName, JSON.stringify(notificationOrderCoreEntity));
  }
}
