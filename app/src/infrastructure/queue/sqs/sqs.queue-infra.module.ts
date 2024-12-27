import { Module } from '@nestjs/common';
import { QueueConfigModule } from '@infrastructure/queue/abstract';
import { SqsConsumerQueueProviderImpl, SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';

const queueConfigModule = QueueConfigModule.forFeature([SqsProducerQueueProviderImpl, SqsConsumerQueueProviderImpl]);
@Module({
  providers: queueConfigModule.providers,
  exports: queueConfigModule.exports,
})
export class SqsQueueInfraModule {}
