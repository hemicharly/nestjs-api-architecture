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
 * import { Module } from '@nestjs/abstract';
 * import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/integration-client/impl/integration-client.provider.impl';
 * import { IntegrationConfigModule } from '@infrastructure/integrations/abstract/abstract.integration.module';
 *
 * const integrationConfigModule = IntegrationConfigModule.forFeature(WebhookIntegrationClientProviderImpl);
 *
 * @Module({
 *   providers: integrationConfigModule.providers,
 *   exports: integrationConfigModule.exports,
 * })
 * export class WebhookIntegrationClientModule {}
 * ```
 *
 * @class IntegrationConfigModule
 */
@Module({})
export class IntegrationConfigModule {
  /**
   * Registers a provider dynamically and exports it for use in other modules.
   *
   * @param integrationClientProviderImpl - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `IntegrationConfigModule` itself.
   * - `providers`: An array containing the dynamically registered provider.
   * - `exports`: An array exporting the token of the registered provider, making it available in other modules.
   */
  static forFeature<T>(integrationClientProviderImpl: Type<T>): DynamicModule {
    const token = integrationClientProviderImpl.name;
    return {
      module: IntegrationConfigModule,
      providers: [
        {
          provide: token,
          useClass: integrationClientProviderImpl,
        },
      ],
      exports: [token],
    };
  }
}
