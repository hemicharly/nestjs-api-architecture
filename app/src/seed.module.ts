import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database.module';
import { RepositoryModule } from '@infrastructure/repositories';

@Module({
  imports: [DatabaseModule, RepositoryModule],
})
export class SeedModule {}
