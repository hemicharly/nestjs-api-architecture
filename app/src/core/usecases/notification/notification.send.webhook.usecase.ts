export interface NotificationSendWebhookUsecase {
  execute(message: string): Promise<void>;
}
