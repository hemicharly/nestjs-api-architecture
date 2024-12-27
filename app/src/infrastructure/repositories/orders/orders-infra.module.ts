import { Module } from '@nestjs/common';
import { OrderEntity } from '@infrastructure/repositories/orders/entity';
import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
import { RepositoryConfigModule } from '@infrastructure/repositories/abstract/repository.config.module';

const repositoryConfigModule = RepositoryConfigModule.forFeature([OrderEntity], OrderRepositoryProviderImpl);

@Module({
  imports: repositoryConfigModule.imports,
  providers: repositoryConfigModule.providers,
  exports: repositoryConfigModule.exports,
})
export class OrdersInfraModule {}
