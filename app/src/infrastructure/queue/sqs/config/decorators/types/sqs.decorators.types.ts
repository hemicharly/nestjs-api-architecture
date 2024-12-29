export interface SqsDecoratorsTypes {
  queueName: string;
  enabledVisibilityTimeout?: boolean;
  visibilityTimeout?: number;
  waitTimeSeconds?: number;
  batchSize?: number;
}
