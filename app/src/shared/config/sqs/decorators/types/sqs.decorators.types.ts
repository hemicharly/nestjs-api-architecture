export interface SqsDecoratorsTypes {
  /**
   * The environment variable name of the SQS queue to use.
   * - Required.
   * - Must be unique within the AWS Account and region context.
   */
  queueNameEnv: string;

  /**
   * Indicates whether the visibility timeout is enabled.
   * - Optional.
   * - Default: `false`.
   * - If `true`, allows configuring a custom visibility timeout for consumed messages.
   */
  enabledVisibilityTimeout?: boolean;

  /**
   * The duration of the visibility timeout in seconds.
   * - Optional.
   * - Default: `30`.
   * - Specifies how long a message remains "invisible" after being consumed.
   * - Relevant only if `enabledVisibilityTimeout` is enabled.
   * - Allowed values: 0 to 43200 seconds (up to 12 hours).
   */
  visibilityTimeout?: number;

  /**
   * The wait time for receiving messages in seconds (long polling).
   * - Optional.
   * - Default: `20`.
   * - Specifies how long the client will wait for messages before returning an empty response.
   * - Allowed values: 0 to 20 seconds.
   */
  waitTimeSeconds?: number;

  /**
   * The maximum number of messages that can be processed in a single batch.
   * - Optional.
   * - Default: `10`.
   * - Specifies the maximum number of messages to be consumed per operation.
   * - Allowed values: 1 to 10.
   */
  batchSize?: number;
}
