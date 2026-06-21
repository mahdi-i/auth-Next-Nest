import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@shared/@types/jwt-payload.type';
import {
  accessTokenExpireTime,
  refreshTokenExpireTime,
} from '@shared/constants/jwt.constants';
import { LoginResponse } from '../types/login-response.type';
@Injectable()
export class JwtAppService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: accessTokenExpireTime,
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async generateRefreshToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: refreshTokenExpireTime,
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        ignoreExpiration: false,
      });

      return payload;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        ignoreExpiration: false,
      });

      return payload;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateToken(payload: JwtPayload): Promise<LoginResponse> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
}
