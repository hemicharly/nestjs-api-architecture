import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export interface NotificationOrderRegisterUsecaseInterface {
  execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void>;
}
