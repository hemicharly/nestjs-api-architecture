import { SqsDecoratorsTypes } from '@infrastructure/queue/sqs/config/decorators/types';

export const SQS_HANDLER_METADATA = 'SQS_HANDLER_METADATA';

export function SqsMessageHandler(options: SqsDecoratorsTypes): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata(SQS_HANDLER_METADATA, { ...options }, descriptor.value);
  };
}
