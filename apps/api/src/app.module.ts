import { AuthModule } from '@mguay/nestjs-better-auth';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import dataSource from '@shared/config/dataSource';
import { betterAuth } from 'better-auth';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
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
