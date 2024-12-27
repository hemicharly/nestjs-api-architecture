import { DynamicModule, Module, Type } from '@nestjs/common';

@Module({})
export class QueueInfraConfigModule {
  static forModules(modules: Type[]): DynamicModule {
    return {
      module: QueueInfraConfigModule,
      imports: modules,
      exports: modules,
    };
  }
}
