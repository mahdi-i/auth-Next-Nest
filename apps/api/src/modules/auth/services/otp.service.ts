import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '@shared/services/cache.service';
import { generateOtp } from '@shared/utils/code-generator.util';
import { Hash } from '@shared/utils/hash';

@Injectable()
export class OtpService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {}
  async sendOtpToPhone(phone: string) {
    const otp = generateOtp();

    await this.cacheService.set(`phone:${phone}`, await Hash(otp), 120);

    if (this.configService.get<string>('NODE_ENV') === 'production') {
      //   await this.smsService.sendOtpToPhone({ code: otp, reciver: phone });
      return {
        message: 'otp sent to your phone',
      };
    }
    return {
      message: 'otp sent to your phone',
      otp,
    };
  }

  async sendOtpToEmail(email: string) {
    const otp = generateOtp();

    await this.cacheService.set(`email:${email}`, await Hash(otp), 120);

    if (this.configService.get<string>('NODE_ENV') === 'production') {
      //   await this.smsService.sendOtpToEmail({ code: otp, reciver: email });
      return {
        message: 'otp sent to your email',
      };
    }
    return {
      message: 'otp sent to your email',
      otp,
    };
  }
}
