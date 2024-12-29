import * as process from 'node:process';

const NODE_ENV = process.env.NODE_ENV || 'development';
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '000000000000';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_SQS_ENDPOINT = NODE_ENV === 'development' ? `http://localstack-dev:4566` : `https://sqs.${AWS_REGION}.amazonaws.com`;
const PORT = process.env.PORT || 3000;

export const configEnv = {
  nodeEnv: NODE_ENV,
  aws: {
    region: AWS_REGION,
    sqs: {
      endpoint: AWS_SQS_ENDPOINT,
      queueUrl: (queueName: string) => `${AWS_SQS_ENDPOINT}/${AWS_ACCOUNT_ID}/${queueName}`,
      queues: {
        queueNotificationOrder: 'queue_notification_order',
      },
    },
  },
  app: {
    host: '0.0.0.0',
    port: PORT,
  },
  database: {
    mongodb: {
      url: process.env.MONGODB_URL,
      synchronize: true,
    },
  },
  integrationsApi: {
    webhook: {
      // baseUrl: process.env.WEBHOOK_URL || 'https://webhook.site/210433f3-e36e-45c2-9c12-b99105df7ed5',
      baseUrl: process.env.WEBHOOK_URL || 'https://eogftuziz11hqu6.m.pipedream.net',
    },
  },
};
