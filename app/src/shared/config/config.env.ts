import * as process from 'node:process';

export const configEnv = {
  aws: {
    sqs: {
      queueNames: {
        queueNotificationOrder: process.env.QUEUE_NOTIFICATION_ORDER || 'queue_notification_order',
      },
    },
  },
  database: {
    mongodb: {
      url: process.env.MONGODB_URL,
      synchronize: true,
    },
  },
};
