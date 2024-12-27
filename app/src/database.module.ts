import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configEnv } from '@src/config.env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: configEnv.database.mongodb.url,
      entities: [__dirname + '/infrastructure/repositories/**/*.entity{.ts,.js}'],
      synchronize: configEnv.database.mongodb.synchronize,
      logging: false,
    }),
  ],
})
export class DatabaseModule {}
