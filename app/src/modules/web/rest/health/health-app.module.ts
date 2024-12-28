import { Module } from '@nestjs/common';
import { HealthController } from '@src/modules/web/rest/health';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthAppModule {}
