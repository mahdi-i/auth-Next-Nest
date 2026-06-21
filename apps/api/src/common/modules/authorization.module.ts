import { AuthModule } from '@core/auth/auth.module';
import { AuthWithHeader } from '@core/auth/guard/auth-header.guard';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@shared/guards/rolse.guard';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthWithHeader,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [],
})
export class AuthorizationModule {}
