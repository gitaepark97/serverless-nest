import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mariadb',
          host: configService.get('MARIADB_HOST'),
          port: parseInt(configService.get('MARIADB_PORT')),
          username: configService.get('MARIADB_USERNAME'),
          password: configService.get('MARIADB_PASSWORD'),
          database: configService.get('MARIADB_DATABASE'),
          entities: [],
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
