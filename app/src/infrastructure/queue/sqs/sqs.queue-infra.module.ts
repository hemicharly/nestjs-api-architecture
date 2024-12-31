import { Module } from '@nestjs/common';
import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { DynamicConfigModule } from '@shared/config/abstract';

@Module({
  ...DynamicConfigModule.forFeature([SqsProducerQueueProviderImpl]),
})
export class SqsQueueInfraModule {}
