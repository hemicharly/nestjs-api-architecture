import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const SwaggerDoc = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('timesheet-in-transit-api')
    .setDescription('The timesheet-in-transit API.')
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Api-Key',
        description: 'api key',
      },
      'X-Api-Key',
    )
    .addServer('http://localhost:3000', 'localhost server')
    .build();

  SwaggerModule.setup('swagger-doc', app, SwaggerModule.createDocument(app, config));
};
