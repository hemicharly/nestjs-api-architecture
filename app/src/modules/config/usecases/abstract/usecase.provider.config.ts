import { Provider, Type } from '@nestjs/common';

/**
 * Utility function to create a provider configuration in NestJS.
 *
 * @param useCaseImpl - The class implementing the use case to be registered as a provider.
 * @param injectImpl - An array of classes (providers) that will be injected as dependencies into the use case.
 *
 * @returns {Provider} - An object representing a NestJS provider configuration.
 *
 * Structure of the returned object:
 * - `provide`: The name of the use case class, used as the token for dependency injection.
 * - `useFactory`: A factory function that creates an instance of the use case, injecting the specified dependencies.
 * - `inject`: An array of class names of the providers to be injected into the use case.
 *
 * Usage example:
 *
 * ```typescript
 * import { Module, Provider } from '@nestjs/shared';
 * import { RepositoryInfraModule } from '@infrastructure/repositories';
 * import { AuthAppModule } from '@modules/web/middleware/apikey';
 * import { OrdersController } from '@modules/web/controllers/orders';
 * import { UsecaseProviderConfig } from '@modules/config/usecases/abstract';
 * import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
 * import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
 * import { SqsQueueInfraModule } from '@infrastructure/queue/sqs';
 * import {
 *   OrderCreationUseCaseImpl,
 *   OrderEndUsecaseImpl,
 *   OrderFindByIdUsecaseImpl,
 *   OrderQueryQuantityStatusUsecaseImpl,
 *   OrderQueryUsecaseImpl,
 *   OrderStartUsecaseImpl
 * } from '@core/usecases/orders/impl';
 * import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
 *
 * const usecaseProvidersConfig: Provider[] = [
 *   UsecaseProviderConfig(OrderCreationUseCaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
 *   UsecaseProviderConfig(OrderQueryUsecaseImpl, [OrderRepositoryProviderImpl]),
 *   UsecaseProviderConfig(OrderQueryQuantityStatusUsecaseImpl, [OrderRepositoryProviderImpl]),
 *   UsecaseProviderConfig(OrderFindByIdUsecaseImpl, [OrderRepositoryProviderImpl]),
 *   UsecaseProviderConfig(OrderEndUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
 *   UsecaseProviderConfig(OrderStartUsecaseImpl, [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl]),
 *   UsecaseProviderConfig(NotificationOrderRegisterUsecaseImpl, [SqsProducerQueueProviderImpl])
 * ];
 *
 * @Module({
 *   imports: [RepositoryInfraModule, AuthAppModule, SqsQueueInfraModule],
 *   controllers: [OrdersController],
 *   providers: usecaseProvidersConfig
 * })
 * export class OrdersAppModule {
 * }
 * ```
 *
 * This utility simplifies the creation of providers in NestJS, particularly when multiple dependencies
 * need to be dynamically injected into a use case.
 */
export const UsecaseProviderConfig = (useCaseImpl: Type, injectImpl: Type[]): Provider => ({
  provide: useCaseImpl.name,
  useFactory: (...args: any[]) => new useCaseImpl(...args),
  inject: injectImpl?.map((m) => m.name) || [],
});
