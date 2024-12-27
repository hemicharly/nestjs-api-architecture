import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/database.module';
import { RepositoryInfraModule } from '@infrastructure/repositories';

@Module({
  imports: [DatabaseModule, RepositoryInfraModule],
})
export class SeedModule {}
