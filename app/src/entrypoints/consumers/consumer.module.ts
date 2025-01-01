import { Module } from '@nestjs/common';
import { NotificationConsumerConfigModule } from '@shared/config/notification';
import { NotificationOrderConsumerService } from '@entrypoints/consumers/notification';

@Module({
  imports: [NotificationConsumerConfigModule],
  providers: [NotificationOrderConsumerService],
})
export class ConsumerModule {}
