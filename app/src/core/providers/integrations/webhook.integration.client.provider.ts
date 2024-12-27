export interface WebhookIntegrationClientProvider {
  sendWebhook(url: string, requestBody: any): Promise<void>;
}
