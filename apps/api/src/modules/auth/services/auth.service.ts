import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from '@shared/services/cache.service';
import { Compare, Hash } from '@shared/utils/hash';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
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
  async register(dto: RegisterDto) {
    const { email, password } = dto;

    const isOtpSentBefore = await this.cacheService.get(`email:${email}`);
    if (isOtpSentBefore) {
      throw new HttpException(
        'otp already sent to your email',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const existUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existUser) throw new BadRequestException('This email already exists.');

    const hashedPassword = await Hash(password);
    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
    });

    await this.userRepo.save(newUser);
    return await this.otpService.sendOtpToEmail(email);
  }

  async login(dto: LoginDto) {
    const { email, code } = dto;
    const existUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (!existUser) {
      throw new BadRequestException('invalid email');
    }

    const otp = await this.cacheService.get(`email:${email}`);
    if (!otp) {
      throw new BadRequestException(
        'OTP expired or not found. Please request a new OTP.',
      );
    }

    if (!(await Compare(code, otp)))
      throw new BadRequestException('invalid otp');

    await this.cacheService.del(`email:${email}`);

    const tokens = await this.jwtService.generateToken({
      role: existUser.role,
      sub: existUser.id,
    });

    existUser.refreshToken = tokens.refreshToken;
    await this.userRepo.save(existUser);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: existUser.id,
        email: existUser.email,
        role: existUser.role,
      },
    };
  }

  async refreshToken(token?: string) {
    if (!token) throw new NotFoundException('token not provided');

    try {
      const payload = await this.jwtService.verifyRefreshToken(token);

      const user = await this.userRepo.findOne({
        where: { id: payload.sub, refreshToken: token },
      });

      if (!user) {
        throw new BadRequestException('this token is not related to you!');
      }

      return await this.jwtService.generateAccessToken({
        sub: user.id,
        role: user.role,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
