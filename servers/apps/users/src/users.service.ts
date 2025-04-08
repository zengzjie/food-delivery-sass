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
import { STATUS_CODE } from './constants';

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

    // Verify whether the email address is a Gmail address.
    const isGmail = email.includes('@gmail.com');

    if (isGmail) {
      // Send email
      await this.emailService.sendMail({
        to: email,
        subject: 'Activate your account!',
        template: 'activation-mail',
        name,
        activationCode,
      });
    } else {
      throw new BadRequestException('Please use a Gmail address to register!');
    }

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
        avatar: {
          create: {
            // public_id: 'user_123_avatar', // 这是 Cloudinary 或 S3 存储的唯一标识
            // url: 'https://res.cloudinary.com/myapp/image/upload/v123456/user_123_avatar.jpg',
            public_id: 'avatar',
            url: 'https://github.com/shadcn.png',
          },
        },
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
        avatar: true,
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
   * @description Create a temporary reset password token
   * @param user
   * @returns
   */
  createResetPasswordToken(user) {
    const resetPasswordToken = this.jwtService.sign(
      {
        user,
      },
      {
        secret: this.configService.get<string>('RESET_PASSWORD_SECRET'),
        expiresIn: '5m',
      },
    );
    return resetPasswordToken;
  }

  /**
   * @description Reset password
   * @param userDto
   * @returns
   */
  async resetPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found with this email!');
    }
    // 生成临时的重置密码 token
    const resetPasswordToken = this.createResetPasswordToken(user);
    // 创建重置密码的链接
    const resetPasswordUrl =
      this.configService.get<string>('CLIENT_SIDE_URI') +
      `/reset-password?token=${resetPasswordToken}`;

    this.emailService.sendMail({
      to: email,
      subject: 'Reset Password',
      template: 'reset-password',
      name: user.name,
      activationCode: resetPasswordUrl,
    });

    return {
      code: STATUS_CODE.SUCCESS,
      msg: 'Reset password link has been sent to your email',
    };
  }

  /**
   * @description Logout user
   */
  async logout(context: GraphContextType) {
    console.log('Logging out user...', context.req.user);
    try {
      await this.redisService.del([
        'user-info',
        `user-token-${(context.req.user as any)?.id}`,
      ]);
      context.req.user = null;
      context.res.cookie('Authorization', '', {
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0), // Immediate invalidation
        secure: process.env.NODE_ENV === 'production', // Set to true if using https
        sameSite: 'lax', // Adjust as needed
        // domain: 'example.com' // production domain
        domain: process.env.NODE_ENV === 'production' ? '.example.com' : '',
      });
    } catch (error) {
      console.log('error => ', error);
    }
  }
}
