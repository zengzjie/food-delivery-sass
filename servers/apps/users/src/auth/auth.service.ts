import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/user.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import { GenerateToken } from '../utils/sendToken';
import { ConfigService } from '@nestjs/config';
import { ConfiguredEnv } from '../typing';
import { RedisService } from '../redis/redis.service';

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
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
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

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new GenerateToken(
        this.configService,
        this.jwtService,
      );
      const { access_token, refresh_token } = tokenSender.sendToken(user);

      await this.redisService.set(
        `user-info`,
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

      // response.cookie('authorization', access_token, {
      //   httpOnly: true,
      //   maxAge: 1000 * 60 * 60 * 24 * 7,
      //   secure: false, // Set to true if using https
      //   sameSite: 'lax', // Adjust as needed
      //   domain: 'example.com' // production domain
      // });

      return {
        access_token,
        refresh_token,
      };
    } else {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
