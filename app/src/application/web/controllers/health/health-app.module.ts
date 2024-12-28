import { Module } from '@nestjs/common';
import { HealthController } from '@application/web/controllers/health/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthAppModule {}
