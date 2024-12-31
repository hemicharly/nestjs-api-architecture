import { Module } from '@nestjs/common';
import { SqsConsumerQueueProviderImpl, SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
import { DynamicConfigModule } from '@shared/config';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigEnvModule } from '@infrastructure/config-env';

@Module({
  imports: [DiscoveryModule, ConfigEnvModule],
  ...DynamicConfigModule.forFeature([SqsProducerQueueProviderImpl, SqsConsumerQueueProviderImpl]),
})
export class SqsQueueInfraModule {}
