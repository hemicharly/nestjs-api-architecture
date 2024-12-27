import { NotificationOrderCoreEntity } from 'src/core/domain/entities/notifications';

export interface NotificationOrderRegisterUsecase {
  execute(notificationOrderCoreEntity: Partial<NotificationOrderCoreEntity>): Promise<void>;
}
