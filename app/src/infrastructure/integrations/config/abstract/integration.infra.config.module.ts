import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({})
export class IntegrationInfraConfigModule {
  static forModules(modules: Type[]): DynamicModule {
    return {
      module: IntegrationInfraConfigModule,
      imports: modules,
      exports: modules,
    };
  }
}
