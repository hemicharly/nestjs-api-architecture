import { Module } from '@nestjs/common';
import { HealthController } from '@application/web/controllers/health/health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthAppModule {}
