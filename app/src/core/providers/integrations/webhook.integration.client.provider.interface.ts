export interface WebhookIntegrationClientProviderInterface {
  sendWebhook(url: string, requestBody: Record<string, any>): Promise<void>;
}
