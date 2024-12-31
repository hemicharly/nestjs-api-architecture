import { Module } from '@nestjs/common';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';
import { DynamicConfigModule } from '@shared/config/abstract';

@Module({
  ...DynamicConfigModule.forModules([SqsQueueInfraModule]),
})
export class QueueInfraModule {}
