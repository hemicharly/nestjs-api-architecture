import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@src/infrastructure';
import { EntrypointsModule } from '@src/entrypoints';
import { DynamicConfigModule } from '@shared/config';

@Module({
  ...DynamicConfigModule.forModules([InfrastructureModule, EntrypointsModule])
})
export class AppModule {}
