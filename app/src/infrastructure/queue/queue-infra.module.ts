import { Module } from '@nestjs/common';
import { QueueInfraConfigModule } from '@infrastructure/queue/abstract';
import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';

const queueInfraConfigModule = QueueInfraConfigModule.forModules([SqsQueueInfraModule]);

@Module({
  imports: [...queueInfraConfigModule.imports],
  exports: [...queueInfraConfigModule.exports],
})
export class QueueInfraModule {}
