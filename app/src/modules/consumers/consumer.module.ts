import { Module } from '@nestjs/common';
import { NotificationOrderConsumerModule } from '@src/modules/consumers/notification';

@Module({
  imports: [NotificationOrderConsumerModule],
})
export class ConsumerModule {}
