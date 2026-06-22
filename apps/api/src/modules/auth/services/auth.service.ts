import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from '@shared/enums/role-app.enum';
import { CacheService } from '@shared/services/cache.service';
import { Compare, Hash } from '@shared/utils/hash';
import { Repository } from 'typeorm';
import { SendOtpDto } from '../dto/send-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { User } from '../entities/user.entity';
import { JwtAppService } from './jwt.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtAppService,
    private readonly otpService: OtpService,
  ) {}
  async sendOtp(dto: SendOtpDto) {
    const { email, password } = dto;

    const existUser = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        refreshToken: true,
      },
    });

    if (existUser) {
      console.log(existUser);
      if (!existUser.password) {
        throw new BadRequestException(
          'Account is corrupted. Please contact support.',
        );
      }
      const isPasswordValid = await Compare(password, existUser.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
    } else {
      const hashedPassword = await Hash(password);
      await this.cacheService.set(
        `temp_password:${email}`,
        hashedPassword,
        300,
      );
    }

    const attemptsKey = `otp_attempts:${email}`;
    const attempts = Number((await this.cacheService.get(attemptsKey)) || 0);

    if (attempts >= 5) {
      throw new HttpException(
        'Too many OTP requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = await this.otpService.sendOtpToEmail(email);
    const otpString = String(otp?.otp || otp);

    if (!otpString) {
      throw new InternalServerErrorException('Failed to generate OTP');
    }

    await this.cacheService.set(`otp:${email}`, otpString, 120);
    await this.cacheService.set(attemptsKey, attempts + 1, 600);

    console.log(`📧 OTP for ${email}:`, otpString);

    return {
      success: true,
      message: 'OTP sent to your email',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, code } = dto;

    const attemptsKey = `otp_verify_attempts:${email}`;
    const attempts = Number((await this.cacheService.get(attemptsKey)) || 0);

    if (attempts >= 3) {
      await this.cacheService.del(`otp:${email}`);
      throw new BadRequestException(
        'Too many failed attempts. Request a new OTP.',
      );
    }

    const storedOtp = await this.cacheService.get(`otp:${email}`);
    if (!storedOtp) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new OTP.',
      );
    }

    const isOtpValid = String(code).trim() === storedOtp;
    if (!isOtpValid) {
      await this.cacheService.set(attemptsKey, attempts + 1, 300);
      throw new BadRequestException('Invalid OTP');
    }

    await this.cacheService.del(`otp:${email}`);
    await this.cacheService.del(attemptsKey);

    let user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      const hashedPassword = await this.cacheService.get(
        `temp_password:${email}`,
      );
      if (!hashedPassword) {
        throw new BadRequestException('Password not found. Please try again.');
      }

      user = this.userRepo.create({
        email,
        password: hashedPassword,
        role: Roles.USER,
      });
      await this.userRepo.save(user);
      await this.cacheService.del(`temp_password:${email}`);
    }

    const tokens = await this.jwtService.generateToken({
      role: user.role,
      sub: user.id,
    });

    const hashedRefreshToken = await Hash(tokens.refreshToken);
    console.log(hashedRefreshToken, '1');
    user.refreshToken = hashedRefreshToken;
    await this.userRepo.save(user);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);

      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await Compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.generateAccessToken({
        sub: user.id,
        role: user.role,
      });

      return newAccessToken;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
