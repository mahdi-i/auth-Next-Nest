import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from '@shared/config/typeorm.config';
import { AuthorizationModule } from '@shared/modules/authorization.module';
import { AppCacheModule } from '@shared/modules/cache.module';
import { RedisModule } from '@shared/modules/redis.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfig }),
    AuthModule,
    RedisModule.forRootAsync(),
    AppCacheModule,
    AuthorizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
