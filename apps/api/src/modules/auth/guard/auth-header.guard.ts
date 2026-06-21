import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { extractTokenFromCookie } from '@shared/utils/extract-token';
import type { Request } from 'express';
import { JwtAppService } from '../services/jwt.service';
@Injectable()
export class AuthWithHeader implements CanActivate {
  constructor(
    private readonly JwtService: JwtAppService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride(
      process.env.IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest<Request>();

    try {
      const token = extractTokenFromCookie(request);
      if (!token) throw new UnauthorizedException('token not provided');

      const payload = await this.JwtService.verifyAccessToken(token);
      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
