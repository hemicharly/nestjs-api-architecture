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
 * import { Module } from '@nestjs/shared';
 * import { WebhookIntegrationClientProviderImpl } from '@infrastructure/integrations/webhook-client/impl';
 * import { IntegrationConfigModule } from '@infrastructure/integrations/config/abstract';
 * import { WebhookConfigModule } from '@infrastructure/integrations/webhook-client/config';
 *
 * const integrationConfigModule = IntegrationConfigModule.forFeature(WebhookIntegrationClientProviderImpl);
 *
 * @Module({
 *   imports: [WebhookConfigModule],
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
   * Registers a provider dynamically and exports it for use in other entrypoints.
   *
   * @param integrationClientProviderImpl - The class type to be registered as a provider.
   * @returns {DynamicModule} - A dynamically configured module containing the provider and its export.
   *
   * Structure of the returned module:
   * - `module`: The `IntegrationConfigModule` itself.
   * - `providers`: An array containing the dynamically registered provider.
   * - `exports`: An array exporting the token of the registered provider, making it available in other entrypoints.
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
