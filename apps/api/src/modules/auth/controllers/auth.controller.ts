import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';

import type { JwtPayload } from '@shared/@types/jwt-payload.type';
import {
  accessTokenExpireTimeByMilliSecond,
  accessTokenName,
  cookieOptions,
  refreshTokenExpireTimeByMilliSecond,
  refreshTokenName,
} from '@shared/constants/jwt.constants';
import { Public } from '@shared/decorators/public.decorator';
import { UserInfo } from '@shared/decorators/user.decorator';
import { setCookies } from '@shared/utils/set-cookie';
import type { Request, Response } from 'express';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Get('profile')
  getProfile(@Req() request: Request) {
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

    return response.json({
      success: true,
      namerefresh: refreshTokenName,
      valuerefresh: tokens.refreshToken,
      maxAgerefresh: refreshTokenExpireTimeByMilliSecond,
      nameaccess: accessTokenName,
      valueaccess: tokens.accessToken,
      maxAgeaccess: accessTokenExpireTimeByMilliSecond,
    });
  }

  @Post('refresh-token')
  @Public()
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies?.[refreshTokenName];

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

  @Post('logout')
  async logout(
    @UserInfo() user: JwtPayload,
    @Res({ passthrough: true }) response: Response,
  ) {
    const logout = await this.service.logout(user.sub);
    response.clearCookie(accessTokenName, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });

    response.clearCookie(refreshTokenName, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
    });
    return response.json({
      success: logout.success,
    });
  }
}
