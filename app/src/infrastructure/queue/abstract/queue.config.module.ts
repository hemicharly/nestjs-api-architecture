import { DynamicModule, Module, Type } from '@nestjs/common';

/**
 * A module utility in NestJS that simplifies the registration of providers dynamically.
 *
 * This class provides a static `forFeature` method, which allows registering a provider dynamically
 * for use in a specific feature/module. The registered provider can then be exported for use in other modules.
 *
 * @example
 *
 * ```typescript
 import { Module } from '@nestjs/shared';
 import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl/send.queue.provider.impl';
 import { QueueConfigModule } from '@infrastructure/queue/abstract';

 const queueConfigModule = QueueConfigModule.forFeature(SqsProducerQueueProviderImpl);

 @Module({
 providers: queueConfigModule.providers,
 exports: queueConfigModule.exports
 })
 export class SqsQueueInfraModule {
 }
 * ```
 *
 * @class QueueConfigModule
 */
@Module({})
export class QueueConfigModule {
  /**
   * Registers a provider dynamically and exports it for use in other modules.
   *
   * @param queueProviderImpl - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `QueueConfigModule` itself.
   * - `providers`: An array containing the dynamically registered provider.
   * - `exports`: An array exporting the token of the registered provider, making it available in other modules.
   */
  static forFeature(queueProviderImpl: Type[]): DynamicModule {
    const exports = queueProviderImpl.map((impl) => impl.name);
    const providers = queueProviderImpl.map((impl) => ({ provide: impl.name, useClass: impl }));
    return {
      module: QueueConfigModule,
      providers: providers,
      exports: exports,
    };
  }
}
