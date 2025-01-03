import { SqsDecoratorType } from '@shared/config/sqs/decorators/types';

export const SQS_HANDLER_METADATA = 'SQS_HANDLER_METADATA';

export function SqsMessageHandler(options: SqsDecoratorType): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(SQS_HANDLER_METADATA, { ...options }, descriptor.value);
  };
}
