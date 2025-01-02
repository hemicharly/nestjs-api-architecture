import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

interface OptionProviderRegister {
  useClass: Type;
  injects?: Type[];
}

/**
 * A utility module in NestJS that simplifies the dynamic registration of providers and modules.
 *
 * This class provides static methods for dynamically registering providers or modules and making them available for use in other parts of the application.
 * It is particularly useful in scenarios where you need flexibility and reusability in configuring dependencies.
 *
 * @class DynamicConfigModule
 */
@Module({})
export class DynamicConfigModule {
  /**
   * Dynamically registers a single provider with optional dependencies and exports it.
   *
   * @param useClass - The class type to be registered as a provider.
   * @param injects - An optional array of class types to be injected into the provider.
   * @returns {Provider} - A provider configuration object for dynamic registration.
   *
   * @example
   * ```typescript
   * import { DynamicConfigModule } from './dynamic-config.module';
   * import { MyService } from './my-service';
   * import { DependencyService } from './dependency-service';
   *
   * const myProvider = DynamicConfigModule.forProvider(MyService, [DependencyService]);
   *
   * @Module({
   *   providers: [myProvider, DependencyService],
   *   exports: [myProvider],
   * })
   * export class MyModule {}
   * ```
   */
  private static forProvider<T>(useClass: Type<T>, injects?: Type[]): Provider {
    if (injects && injects.length > 0) {
      return {
        provide: useClass,
        useFactory: (...args: any[]) => new useClass(...args),
        useClass,
        inject: injects,
      };
    }
    return {
      provide: useClass,
      useClass: useClass,
    };
  }

  /**
   * Dynamically registers a single provider with optional dependencies and exports it.
   *
   * @param options - The options to be registered as a provider.
   * @returns {Partial<DynamicModule>} - A provider configuration object for dynamic registration.
   *
   * @example
   * ```typescript
   * import { Module } from '@nestjs/common';
   * import { InfrastructureModule } from '@src/infrastructure';
   * import { DynamicConfigModule } from '@shared/config';
   * import { OrderCreationUseCaseImpl, OrderEndUsecaseImpl, OrderFindByIdUsecaseImpl, OrderQueryQuantityStatusUsecaseImpl, OrderQueryUsecaseImpl, OrderStartUsecaseImpl } from '@core/usecases/orders/impl';
   * import { OrderRepositoryProviderImpl } from '@infrastructure/repositories/orders/impl';
   * import { NotificationOrderRegisterUsecaseImpl } from '@core/usecases/notification/impl';
   * import { SqsProducerQueueProviderImpl } from '@infrastructure/queue/sqs/impl';
   * import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';
   *
   * @Module({
   *   imports: [InfrastructureModule],
   *   ...DynamicConfigModule.forProviderRegister([
   *     { useClass: OrderCreationUseCaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
   *     { useClass: OrderQueryUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
   *     { useClass: OrderQueryQuantityStatusUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
   *     { useClass: OrderFindByIdUsecaseImpl, injects: [OrderRepositoryProviderImpl] },
   *     { useClass: OrderEndUsecaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
   *     { useClass: OrderStartUsecaseImpl, injects: [OrderRepositoryProviderImpl, NotificationOrderRegisterUsecaseImpl] },
   *     { useClass: NotificationOrderRegisterUsecaseImpl, injects: [SqsProducerQueueProviderImpl, ConfigEnvProviderImpl] },
   *   ]),
   * })
   * export class OrdersWebConfigModule {}
   * ```
   */
  static forProviderRegister(options: OptionProviderRegister[]): Partial<DynamicModule> {
    const providers: Provider[] = options.map(({ useClass, injects }) => this.forProvider(useClass, injects));
    return {
      providers: [...providers],
      exports: [...providers],
    };
  }

  /**
   * Dynamically registers an array of modules and exports them for use in other modules.
   *
   * @param modules - An array of class types to be registered as modules.
   * @returns {Partial<DynamicModule>} - A dynamically configured module containing the registered modules and their exports.
   *
   * @example
   * ```typescript
   * import { DynamicConfigModule } from './dynamic-config.module';
   * import { SomeOtherModule } from './some-other.module';
   *
   * @Module({
   *   imports: [DynamicConfigModule.forModules([SomeOtherModule])],
   * })
   * export class MyModule {}
   * ```
   */
  static forModules(modules: Type[]): Partial<DynamicModule> {
    return {
      imports: [...modules],
      exports: [...modules],
    };
  }
}
