import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
