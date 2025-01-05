import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';
import { NotificationOrderRegisterUsecaseInterface } from '@core/usecases/notification';
import { ProducerQueueProviderInterface } from '@core/providers/queue';
import { ConfigEnvProviderInterface } from '@core/providers/config-env';

export class NotificationOrderRegisterUsecaseImpl
  implements NotificationOrderRegisterUsecaseInterface
{
  constructor(
    private readonly sendQueueProvider: ProducerQueueProviderInterface,
    private readonly configEnvProvider: ConfigEnvProviderInterface
  ) {}
  public async execute(
    notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>
  ): Promise<void> {
    const queueName = this.configEnvProvider.getString('QUEUE_NOTIFICATION_ORDER');
    await this.sendQueueProvider.sendMessage(
      queueName,
      JSON.stringify(notificationOrderCoreEntity)
    );
  }
}
