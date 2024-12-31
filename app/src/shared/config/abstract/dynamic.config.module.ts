import { DynamicModule, Module, Provider, Type } from '@nestjs/common';

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
   * Dynamically registers an array of providers and exports them for use in other modules.
   *
   * @param providersImpl - An array of class types to be registered as providers.
   * @returns {Partial<DynamicModule>} - A dynamically configured module containing the providers and their exports.
   *
   * @example
   * ```typescript
   * import { DynamicConfigModule } from './dynamic-config.module';
   * import { MyService } from './my-service';
   *
   * @Module({
   *   imports: [DynamicConfigModule.forFeature([MyService])],
   * })
   * export class MyModule {}
   * ```
   */
  static forFeature(providersImpl: Type[]): Partial<DynamicModule> {
    return {
      providers: providersImpl.map((impl) => ({
        provide: impl.name,
        useClass: impl,
      })),
      exports: providersImpl.map((impl) => impl.name),
    };
  }

  /**
   * Dynamically registers a single provider with optional dependencies and exports it.
   *
   * @param providerImpl - The class type to be registered as a provider.
   * @param injectsImpl - An optional array of class types to be injected into the provider.
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
  static forProvider(providerImpl: Type, injectsImpl?: Type[]): Provider {
    return {
      provide: providerImpl.name,
      useFactory: (...args: any[]) => new providerImpl(...args),
      inject: injectsImpl?.map((dep) => dep.name) || [],
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
      module: DynamicConfigModule,
      imports: modules,
      exports: modules,
    };
  }
}
