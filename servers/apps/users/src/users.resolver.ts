import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entities';
import {
  ActivationResponse,
  BaseResponse,
  LoginResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from './types/user.type';
import {
  ActivationDto,
  DeleteUserDto,
  ExecutePasswordResetDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { STATUS_CODE } from './constants';
import { Post } from './posts/entities/post.entities';
import { GraphContextType } from './typing';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: GraphContextType,
  ): Promise<RegisterResponse> {
    const { name, email, password, mobile } = registerDto;
    if (!name || !email || !password || !mobile) {
      throw new BadRequestException('Please fill the all fields');
    }
    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationInput') activationDto: ActivationDto,
    @Context() context: GraphContextType,
  ): Promise<ActivationResponse> {
    const { activation_token, activation_code } = activationDto;
    if (!activation_code) {
      throw new BadRequestException('Please enter the activation code');
    }
    if (!activation_token) {
      throw new BadRequestException(
        'The captcha has expired, please re-register',
      );
    }

    await this.usersService.activateUser(
      {
        activation_token,
        activation_code,
      },
      context.res,
    );

    return {
      code: STATUS_CODE.SUCCESS,
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: GraphContextType,
  ): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const result = await this.authService.login(
      {
        email,
        password,
      },
      context.res,
    );
    return result;
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Args('refresh_token') refresh_token: string,
    @Context() context: GraphContextType,
  ): Promise<RefreshTokenResponse> {
    const result = await this.authService.refreshToken(
      refresh_token,
      context.res,
    );
    return result;
  }

  @Mutation(() => BaseResponse)
  async deleteUser(
    @Args('deleteUserInput') deleteUserDto: DeleteUserDto,
  ): Promise<BaseResponse> {
    try {
      await this.usersService.delete(deleteUserDto.id);
      return {
        code: STATUS_CODE.SUCCESS,
      };
    } catch (error) {
      return {
        code: STATUS_CODE.INTERNAL_SERVER_ERROR,
        error: {
          msg: error?.meta?.cause,
        },
      };
    }
  }

  @Query(() => User)
  async getUserDetail(@Context() context: GraphContextType): Promise<User> {
    const access_token = context.req.cookies['Authorization'];
    const user = await this.jwtService.verify(access_token, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
    return this.usersService.getUserDetail({ id: user?.sub });
  }

  @Query(() => BaseResponse)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordDto: ResetPasswordDto,
  ): Promise<BaseResponse> {
    const { email } = resetPasswordDto;
    if (!email) {
      throw new BadRequestException('Please enter the email');
    }
    const result = await this.usersService.resetPassword(email);
    return result;
  }

  @Mutation(() => BaseResponse)
  async executePasswordReset(
    @Args('executePasswordResetInput')
    executePasswordResetDto: ExecutePasswordResetDto,
  ): Promise<BaseResponse> {
    const result = await this.usersService.executePasswordReset(
      executePasswordResetDto,
    );
    return result;
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    if (!user.id) {
      return [];
    }
    return this.usersService.getUserPosts(user.id);
  }

  @Mutation(() => BaseResponse)
  async logout(@Context() context: GraphContextType): Promise<BaseResponse> {
    try {
      await this.usersService.logout(context);
      return {
        code: STATUS_CODE.SUCCESS,
        msg: 'Logout successfully',
      };
    } catch (error) {
      return {
        code: STATUS_CODE.INTERNAL_SERVER_ERROR,
        error: {
          msg: error?.meta?.cause,
        },
      };
    }
  }
}
