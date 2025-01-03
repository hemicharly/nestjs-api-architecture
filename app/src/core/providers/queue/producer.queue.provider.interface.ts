export interface ProducerQueueProviderInterface {
  sendMessage(queueName: string, message: string): Promise<void>;

  sendMessageWithDelayAndAttempt(queueName: string, message: string, delaySeconds: number, attempt: number): Promise<void>;
}
