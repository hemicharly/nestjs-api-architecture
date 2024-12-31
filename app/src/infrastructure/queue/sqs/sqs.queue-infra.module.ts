import { Module } from '@nestjs/common';
import { SqsConsumerQueueProviderImpl, SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { DynamicConfigModule } from '@shared/config/abstract';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [DiscoveryModule],
  ...DynamicConfigModule.forFeature([SqsProducerQueueProviderImpl, SqsConsumerQueueProviderImpl]),
})
export class SqsQueueInfraModule {}
