import { Module } from '@nestjs/common';
import { WebModule } from '@entrypoints/web';
import { ConsumerModule } from '@src/entrypoints/consumers';

@Module({
  imports: [WebModule, ConsumerModule],
})
export class AppModule {}
