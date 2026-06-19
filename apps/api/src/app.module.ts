import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSource from '@shared/config/dataSource';
import { betterAuth } from 'better-auth';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres' as const,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: false,
        entities: ['dist/typeorm/entities/**/*.js', 'dist/**/*.entity.js'],
        dataSourceFactory: async () => {
          if (!dataSource.isInitialized) {
            await dataSource.initialize();
          }
          return dataSource;
        },
      }),
    }),
    AuthModule.forRootAsync({
      useFactory: () => ({
        auth: betterAuth({
          database: typeormAdapter(dataSource),
        }),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.APP_URL,
        trustedOrigins: [process.env.APP_URL],
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
