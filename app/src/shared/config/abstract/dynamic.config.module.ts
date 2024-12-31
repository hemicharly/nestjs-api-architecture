import { DynamicModule, Module, Type } from '@nestjs/common';

/**
 * A module utility in NestJS that simplifies the registration of providers dynamically.
 *
 * This class provides a static `forFeature` method, which allows registering a provider dynamically
 * for use in a specific feature/module. The registered provider can then be exported for use in other entrypoints.
 *
 * @example
 *
 * ```typescript

 * ```
 *
 * @class DynamicConfigModule
 */
@Module({})
export class DynamicConfigModule {
  /**
   * Registers a provider dynamically and exports it for use in other entrypoints.
   *
   * @param providersImpl - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `IntegrationConfigModule` itself.
   * - `providers`: An array containing the dynamically registered provider.
   * - `exports`: An array exporting the token of the registered provider, making it available in other entrypoints.
   */
  static forFeature(providersImpl: Type[]): Partial<DynamicModule> {
    return {
      providers: providersImpl.map((impl) => ({
        provide: impl.name,
        useClass: impl,
      })),
      exports: providersImpl.map((p) => p.name),
    };
  }

  /**
   * Registers a modules dynamically and exports it for use in other entrypoints.
   *
   * @param modules - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `DynamicConfigModule` itself.
   * - `imports`: An array containing the dynamically registered imports.
   * - `exports`: An array containing the dynamically registered exports.
   */
  static forModules(modules: Type[]): Partial<DynamicModule> {
    return {
      module: DynamicConfigModule,
      imports: modules,
      exports: modules,
    };
  }
}
