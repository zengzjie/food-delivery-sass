import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { Response } from 'express';
import { RegisterDto, ActivationDto, GetUserDto } from './dto/user.dto';
import { EmailService } from './email/email.service';
import { GraphContextType } from './typing';
import { RedisService } from './redis/redis.service';

interface UserData {
  name: string;
  email: string;
  password: string;
  mobile: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * @description Create activation token
   * @param user
   * @returns
   */
  async createActivationToken(user: UserData) {
    // Create a 6-digit activation code
    const activation_code = Math.floor(100000 + Math.random() * 900000) + '';

    const activation_token = this.jwtService.sign(
      {
        user,
        activation_code,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );

    return {
      activation_token,
      activation_code,
    };
  }

  /**
   * @description User registered
   * @param registerDto
   * @param response
   * @returns
   */
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, mobile } = registerDto;
    // Determine whether the email already exists
    const isEmailExist = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isEmailExist) {
      throw new BadRequestException('Email already exists with this email!');
    }

    const isPhoneExist = await this.prisma.user.findUnique({
      where: {
        mobile,
      },
    });
    if (isPhoneExist) {
      throw new BadRequestException(
        'Phone number already exists with this phone number!',
      );
    }

    const encryptionPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: encryptionPassword,
      mobile,
    };

    // Create activation token
    const { activation_token, activation_code: activationCode } =
      await this.createActivationToken(user);

    // Send email
    await this.emailService.sendMail({
      to: email,
      subject: 'Activate your account!',
      template: 'activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  /**
   * @description Activate user
   * @param activationDto
   */
  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activation_token, activation_code } = activationDto;

    const verifyUser: { user: UserData; activation_code: string } =
      this.jwtService.verify(activation_token, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      });

    if (verifyUser.activation_code !== activation_code) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, mobile } = verifyUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        mobile,
      },
    });

    return { response };
  }

  /**
   * @description Delete user
   * @param id
   * @returns
   */
  async delete(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  /**
   * @description Get user detail
   * @param userDto
   * @returns
   */
  async getUserDetail(userDto: GetUserDto) {
    const { id } = userDto;
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async getUserPosts(id: string) {
    return this.prisma.post.findMany({
      where: {
        userId: id,
      },
    });
  }

  /**
   * @description Logout user
   */
  async logout(context: GraphContextType) {
    console.log('Logging out user...', context.req.user);
    try {
      await this.redisService.del([
        'user-info',
        `user-token-${(context.req.user as any)?.userId}`,
      ]);
      context.req.user = null;
    } catch (error) {
      console.log('error => ', error);
    }
  }
}
