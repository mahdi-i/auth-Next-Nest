import { typeormAdapter } from '@hedystia/better-auth-typeorm';
import dataSource from '@shared/config/dataSource';
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: typeormAdapter(dataSource),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.APP_URL,
  trustedOrigins: [process.env.APP_URL || 'http://localhost:3000'],
});
