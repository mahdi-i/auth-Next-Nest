import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import { ApiProperty } from '@nestjs/swagger';
import {
  accessTokenExpireTimeByMilliSecond,
  accessTokenName,
  refreshTokenExpireTimeByMilliSecond,
  refreshTokenName,
} from '@shared/constants/jwt.constants';
import { Cookie } from '@shared/decorators/cookie.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { setCookies } from '@shared/utils/set-cookie';
import type { Response } from 'express';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('text-action')
  test() {
    return { kir: true };
  }
  @Get('text-action')
  gettest() {
    return { kir: true };
  }

  @Post('sendOtp')
  @Public()
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.service.sendOtp(dto);
  }

  @Post('verifyOtp')
  @Public()
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res() response: Response) {
    const tokens = await this.service.verifyOtp(dto);

    setCookies(response, [
      {
        name: refreshTokenName,
        value: tokens.refreshToken,
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: refreshTokenExpireTimeByMilliSecond,
        },
      },
      {
        name: accessTokenName,
        value: tokens.accessToken,
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: accessTokenExpireTimeByMilliSecond,
        },
      },
    ]);
  }

  @Post('refresh-token')
  @Public()
  @ApiProperty({
    description: 'Refresh token for obtaining a new access token',
    example: 'yJV_adQssw5c...',
    required: true,
  })
  async refreshToken(
    @Cookie(refreshTokenName) token: string,
    @Res() response: Response,
  ) {
    const accessToken = await this.service.refreshToken(token);

    setCookies(response, [
      {
        name: accessTokenName,
        value: accessToken,
        options: {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: accessTokenExpireTimeByMilliSecond,
        },
      },
    ]);
    return {
      success: true,
      accessToken,
    };
  }
}
