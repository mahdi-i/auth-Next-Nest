import { Body, Controller, Post } from '@nestjs/common';

import { refreshTokenName } from '@shared/constants/jwt.constants';
import { Cookie } from '@shared/decorators/cookie.decorator';
import { Public } from '@shared/decorators/public.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.service.login(dto);

    return {
      success: true,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      user: {
        id: user.user.id,
        email: user.user.email,
        role: user.user.role,
      },
    };
  }

  @Post('refresh-token')
  async refreshToken(@Cookie(refreshTokenName) token: string) {
    const accessToken = await this.service.refreshToken(token);

    return {
      success: true,
      accessToken: accessToken,
    };
  }
}
