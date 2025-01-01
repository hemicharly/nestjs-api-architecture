import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { EntrypointsModule } from '@src/entrypoints';

@Module({
  imports: [InfrastructureModule, EntrypointsModule],
})
export class AppModule {}
