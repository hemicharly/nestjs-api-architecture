import { Module } from '@nestjs/common';
import { WebModule } from '@application/web';
import { ConsumerModule } from '@src/modules/consumers';

@Module({
  imports: [WebModule, ConsumerModule],
})
export class AppModule {}
