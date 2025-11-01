import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DATABASE_HOST'),
        port: +cfg.get('DATABASE_PORT'),
        username: cfg.get('DATABASE_USER'),
        password: cfg.get('DATABASE_PASSWORD'),
        database: cfg.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // dev only
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
