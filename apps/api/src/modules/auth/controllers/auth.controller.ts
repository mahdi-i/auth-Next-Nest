import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import {
  accessTokenExpireTimeByMilliSecond,
  accessTokenName,
  refreshTokenExpireTimeByMilliSecond,
  refreshTokenName,
} from '@shared/constants/jwt.constants';
import { Public } from '@shared/decorators/public.decorator';
import { setCookies } from '@shared/utils/set-cookie';
import type { Request, Response } from 'express';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const user = request.user;
    return {
      id: user?.sub,
      role: user?.role,
      message: 'This is protected data!',
    };
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
    return response.json({
      success: true,
    });
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies?.[refreshTokenName];

    console.log('📨 Cookies received:', request.cookies);
    console.log('🔑 Refresh token from cookie:', refreshToken ? 'Yes' : 'No');

    if (!refreshToken) {
      return response.status(401).json({
        success: false,
        message: 'Refresh token not provided',
      });
    }

    try {
      const accessToken = await this.service.refreshToken(refreshToken);

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

      return response.json({
        success: true,
        accessToken,
      });
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: error.message || 'Refresh token failed',
      });
    }
  }
}
