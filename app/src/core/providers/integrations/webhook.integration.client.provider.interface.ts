export interface WebhookIntegrationClientProviderInterface {
  sendWebhook(url: string, requestBody: any): Promise<void>;
}
