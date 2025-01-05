import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigEnvModule } from '@infrastructure/config-env';
import { ConfigEnvProviderInterface } from '@core/providers/config-env';
import { ConfigEnvProviderImpl } from '@infrastructure/config-env/impl';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigEnvModule],
      useFactory: async (configEnvProvider: ConfigEnvProviderInterface) => ({
        type: 'mongodb',
        url: configEnvProvider.getString('MONGODB_URL'),
        entities: [__dirname + '/infrastructure/repositories/**/*.entity{.ts,.js}'],
        synchronize: configEnvProvider.getBoolean('TYPER_ORM_SYNCHRONIZE', false),
        logging: false
      }),
      inject: [ConfigEnvProviderImpl]
    })
  ]
})
export class DatabaseModule {}
