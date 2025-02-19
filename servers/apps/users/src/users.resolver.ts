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
  RegisterResponse,
} from './types/user.type';
import {
  ActivationDto,
  DeleteUserDto,
  LoginDto,
  RegisterDto,
} from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { STATUS_CODE } from './constants';
import { Post } from './posts/entities/post.entities';
import { GraphContextType } from './typing';
import { AuthService } from './auth/auth.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
  async login(@Args('loginInput') loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const token = await this.authService.login({
      email,
      password,
    });
    return token;
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
  async getUserDetail(@Args('id') id: string): Promise<User> {
    return this.usersService.getUserDetail({ id });
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    return this.usersService.getUserPosts(user.id);
  }

  @Query(() => BaseResponse)
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
