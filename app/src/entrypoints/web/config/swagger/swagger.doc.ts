import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import packageJson from '@packageJson';

export const SwaggerDoc = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'X-Api-Key',
        description: 'api key'
      },
      'X-Api-Key'
    )
    .addServer('http://localhost:3000', 'localhost server')
    .build();

  SwaggerModule.setup('swagger-doc', app, SwaggerModule.createDocument(app, config));
};
