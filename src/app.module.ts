import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { HealthCheckController } from './health-check/health-check.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { Users } from './entities/Users';
import { Sessions } from './entities/Sessions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mariadb',
          host: configService.get('MARIADB_HOST'),
          port: configService.get('MARIADB_PORT') as number,
          username: configService.get('MARIADB_USERNAME'),
          password: configService.get('MARIADB_PASSWORD'),
          database: configService.get('MARIADB_DATABASE'),
          entities: [Users, Sessions],
        };
      },
      inject: [ConfigService],
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [HealthCheckController],
})
export class AppModule {}
