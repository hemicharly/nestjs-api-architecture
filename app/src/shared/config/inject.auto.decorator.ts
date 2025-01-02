import { Inject } from '@nestjs/common';
import { DynamicConfigModule } from '@shared/config/index';

export function InjectAuto(): PropertyDecorator {
  return async (target: Object, propertyKey: string) => {
    const classImplementation = DynamicConfigModule.getClassImplementation(propertyKey);
    Inject(classImplementation)(target, propertyKey);
  };
}
