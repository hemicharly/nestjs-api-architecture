import { Module } from '@nestjs/common';
import { WebApplicationModule } from '@application/web/web.application.module';
import { ConsumerApplicationModule } from '@application/consumers';

@Module({
  imports: [WebApplicationModule, ConsumerApplicationModule],
})
export class AppModule {}
