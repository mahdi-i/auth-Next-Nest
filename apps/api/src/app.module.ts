import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { auth } from '@core/auth/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { initializeDataSource } from '@shared/validation/initializeDataSource';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: true,
        entities: ['dist/typeorm/entities/**/*.js', 'dist/**/*.entity.js'],
        dataSourceFactory: initializeDataSource,
      }),
    }),
    AuthModule.forRootAsync({
      useFactory: () => ({
        auth,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
