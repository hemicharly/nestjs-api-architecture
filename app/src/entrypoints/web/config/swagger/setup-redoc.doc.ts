import redoc from 'redoc-express';
import { INestApplication } from '@nestjs/common';

export const SetupRedoc = (app: INestApplication) => {
  const redocOptions = {
    title: 'timesheet-in-transit-api',
    version: '1.0.0',
    specUrl: '/swagger-doc-json',
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#6EC5AB',
          },
        },
        typography: {
          fontFamily: `"museo-sans", 'Helvetica Neue', Helvetica, Arial, sans-serif`,
          fontSize: '15px',
          lineHeight: '1.5',
          code: {
            code: '#87E8C7',
            backgroundColor: '#4D4D4E',
          },
        },
        menu: {
          backgroundColor: '#ffffff',
        },
      },
    },
  };
  app.use('/swagger', redoc(redocOptions));
};
