import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/user.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GenerateToken } from '../utils/sendToken';
import { ConfigService } from '@nestjs/config';
import { ConfiguredEnv } from '../typing';
import { RedisService } from '../redis/redis.service';
import { decrypt } from '../utils/decrypt';
import { Response } from 'express';
import { STATUS_CODE } from '../constants';
import {
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from '../utils/setCookie';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<ConfiguredEnv>,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async comparePassword(password, hashPassword): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  /**
   * @description User login
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto, response: Response) {
    const { email, password: encryptPassWord } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        posts: {
          include: {
            user: true,
          },
        },
        avatar: true,
      },
    });

    // Decrypt password
    const password = decrypt(encryptPassWord);

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new GenerateToken(
        this.configService,
        this.jwtService,
      );
      const { access_token, refresh_token } = tokenSender.sendToken(user);

      await this.redisService.set(
        'user-info',
        JSON.stringify({
          id: user.id,
          sex: user.sex,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
          avatar: user.avatar,
        }),
        60 * 30000,
      );

      // save token in redis
      await this.redisService.set(
        `user-token-${user.id}`,
        access_token,
        60 * 30000,
      );

      setAccessTokenCookie(response, access_token);
      setRefreshTokenCookie(response, refresh_token);

      return {
        code: STATUS_CODE.SUCCESS,
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }

  async refreshToken(rt: string, response: Response) {
    const payload = this.jwtService.verify(rt, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        posts: {
          include: {
            user: true,
          },
        },
        avatar: true,
      },
    });
    await this.redisService.del(['user-info', `user-token-${user?.id}`]);
    const tokenSender = new GenerateToken(this.configService, this.jwtService);
    const { access_token, refresh_token } = tokenSender.sendToken(user);
    await this.redisService.set(
      'user-info',
      JSON.stringify({
        id: user.id,
        sex: user.sex,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        avatar: user.avatar,
      }),
      60 * 30000,
    );
    await this.redisService.set(
      `user-token-${user.id}`,
      access_token,
      60 * 30000,
    );

    setAccessTokenCookie(response, access_token);
    setRefreshTokenCookie(response, refresh_token);

    return {
      success: true,
    };
  }
}
