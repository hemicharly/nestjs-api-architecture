import { Module } from '@nestjs/common';
import { NotificationOrderListenerModule } from '@application/consumers/notification';

@Module({
  imports: [NotificationOrderListenerModule],
})
export class ConsumerApplicationModule {}
