import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({})
export class RepositoryInfraConfigModule {
  static forModules(modules: Type[]): DynamicModule {
    return {
      module: RepositoryInfraConfigModule,
      imports: modules,
      exports: modules,
    };
  }
}
