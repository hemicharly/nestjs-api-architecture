import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';

@Module({
  imports: [InfrastructureModule]
})
export class SeedModule {}
