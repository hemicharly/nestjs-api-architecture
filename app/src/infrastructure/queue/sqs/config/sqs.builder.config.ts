import { ConfigEnvProvider } from '@core/providers/config-env';
import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';

export class SqsBuilderConfig {
  public static builderClient(configEnvProvider: ConfigEnvProvider): SQSClient {
    const config: SQSClientConfig = {
      region: configEnvProvider.getString('AWS_REGION', 'us-east-1'),
      endpoint: configEnvProvider.getString('AWS_SQS_ENDPOINT'),
    };
    if (configEnvProvider.getString('NODE_ENV', 'development') === 'development') {
      config.credentials = { accessKeyId: 'test', secretAccessKey: 'test' };
    }
    return new SQSClient(config);
  }

  public static builderQueueUrl(queueName: string, configEnvProvider: ConfigEnvProvider): string {
    const awsAccountId = configEnvProvider.getString('AWS_ACCOUNT_ID');
    const sqsEndpoint = configEnvProvider.getString('AWS_SQS_ENDPOINT');
    return `${sqsEndpoint}/${awsAccountId}/${queueName}`;
  }
}
