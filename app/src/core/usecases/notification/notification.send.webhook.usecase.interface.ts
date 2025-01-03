export interface NotificationSendWebhookUsecaseInterface {
  execute(message: string): Promise<void>;
}
