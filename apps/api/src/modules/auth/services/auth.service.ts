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
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const isOtpSentBefore = await this.cacheService.get(`email:${email}`);
    if (isOtpSentBefore) {
      throw new HttpException(
        'otp already sent to your email',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const existUser = await this.userRepo.findOne({
      where: { email: email },
    });

    if (existUser) {
      if (!existUser.password) {
        console.error(`❌ User ${email} has no password in database`);
        throw new BadRequestException(
          'Account is corrupted. Please contact support.',
        );
      }

      // ✅ دیباگ: لاگ کردن اطلاعات
      console.log(`🔍 Comparing password for user: ${email}`);
      console.log(`📝 Password length: ${password?.length || 0}`);
      console.log(`🔑 Hashed password exists: ${!!existUser.password}`);
      console.log(
        `🔑 Hashed password preview: ${existUser.password.substring(0, 20)}...`,
      );
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
    const otp = await this.otpService.sendOtpToEmail(email);
    const otpString = String(otp?.otp || otp);
    if (!otpString) {
      throw new InternalServerErrorException('Failed to generate OTP');
    }
    const hashedOtp = await Hash(String(otpString));
    await this.cacheService.set(`otp:${email}`, hashedOtp, 120);
    console.log(otp);
    console.log(`📧 OTP for ${email}:`, otpString);

    return {
      success: true,
      message: 'OTP sent to your email',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, code } = dto;

    const otp = await this.cacheService.get(`otp:${email}`);
    if (!otp) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new OTP.',
      );
    }
    const otpString = String(otp);
    const codeString = String(code).trim();
    if (!(await Compare(codeString, otpString)))
      throw new BadRequestException('invalid otp');

    await this.cacheService.del(`otp:${email}`);
    let user = await this.userRepo.findOne({
      where: { email },
    });

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

    user.refreshToken = tokens.refreshToken;
    await this.userRepo.save(user);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    console.log(
      '🔄 Refresh token received in service:',
      refreshToken?.substring(0, 20) + '...',
    );

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      console.log('✅ Refresh token payload:', payload);

      const user = await this.userRepo.findOne({
        where: { id: payload.sub, refreshToken },
      });

      if (!user) {
        console.error('❌ User not found with this refresh token');
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = await this.jwtService.generateAccessToken({
        sub: user.id,
        role: user.role,
      });

      console.log('✅ New access token generated for user:', user.id);
      return newAccessToken;
    } catch (error) {
      console.error('❌ Refresh error:', error);
      throw error;
    }
  }
}
