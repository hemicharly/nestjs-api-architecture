import { NotificationOrderCoreEntity } from '@core/domain/entities/notifications';

export interface NotificationOrderRegisterUsecase {
  execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void>;
}
