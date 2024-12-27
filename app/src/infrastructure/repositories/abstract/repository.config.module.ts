import { DynamicModule, Module, Type } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

/**
 * A module utility in NestJS that simplifies the registration of providers dynamically.
 *
 * This class provides a static `forFeature` method, which allows registering a provider dynamically
 * for use in a specific feature/module. The registered provider can then be exported for use in other modules.
 *
 * @example
 *
 * ```typescript
 * import { Module } from '@nestjs/common';
 * import { OrderEntity } from '@infrastructure/repositories/orders/entity';
 * import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
 * import { RepositoryConfigModule } from '@infrastructure/repositories/abstract/repository.config.module';
 *
 * const repositoryConfigModule = RepositoryConfigModule.forFeature([OrderEntity], OrderRepositoryProviderImpl);
 *
 * @Module({
 *   imports: repositoryConfigModule.imports,
 *   providers: repositoryConfigModule.providers,
 *   exports: repositoryConfigModule.exports,
 * })
 * export class OrdersInfraModule {}
 * ```
 *
 * @class RepositoryConfigModule
 */

@Module({})
export class RepositoryConfigModule {
  /**
   * Registers a provider dynamically and exports it for use in other modules.
   *
   * @param entity - The class type to be registered an entity database.
   * @param repositoryProviderImpl - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `RepositoryConfigModule` itself.
   * - `providers`: An array containing the dynamically registered provider.
   * - `exports`: An array exporting the token of the registered provider, making it available in other modules.
   */
  static forFeature<T>(entity: EntityClassOrSchema[], repositoryProviderImpl: Type<T>): DynamicModule {
    const token = repositoryProviderImpl.name;
    return {
      module: RepositoryConfigModule,
      imports: [TypeOrmModule.forFeature(entity)],
      providers: [
        {
          provide: token,
          useClass: repositoryProviderImpl,
        },
      ],
      exports: [token],
    };
  }
}
