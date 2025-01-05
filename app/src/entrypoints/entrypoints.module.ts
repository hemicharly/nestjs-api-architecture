import { Module } from '@nestjs/common';
import { DynamicConfigModule } from '@shared/config';
import { WebModule } from '@entrypoints/web';
import { ConsumerModule } from '@entrypoints/consumers';

@Module({
  ...DynamicConfigModule.forModules([WebModule, ConsumerModule])
})
export class EntrypointsModule {}
