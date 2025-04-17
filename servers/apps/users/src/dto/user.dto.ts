import { InputType, Field, PickType } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';

/**
 * idDto
 */
@InputType()
export class BaseDto {
  @Field()
  @IsNotEmpty({ message: 'id is required.' })
  id: string;
}

/**
 * 注册Dto
 */
@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({
    message: 'Name is required.',
  })
  @IsString({
    message: 'Name must need to be one string.',
  })
  name: string;

  @Field()
  @IsNotEmpty({
    message: 'Password is required.',
  })
  @MaxLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;

  @Field()
  @IsNotEmpty({
    message: 'Email is required.',
  })
  @IsEmail({}, { message: 'Email is Invalid.' })
  email: string;

  @Field()
  @IsNotEmpty({
    message: 'Phone Number is required.',
  })
  // Acceptance phone number
  @Matches(/^[0-9]{10,11}$/, {
    message: 'Phone Number must be 10-11 digits.',
  })
  mobile: string;
}

/**
 * 登录Dto
 */
@InputType()
export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}

/**
 * 删除用户Dto
 */
@InputType()
export class DeleteUserDto extends BaseDto {}

/**
 * 获取用户信息Dto
 */
@InputType()
export class GetUserDto extends BaseDto {}

/**
 * 激活码Dto
 */
@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'Activation Token is required.' })
  activation_token: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Code is required.' })
  activation_code: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be valid.' })
  email: string;
}

@InputType()
export class ExecutePasswordResetDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(8, { message: 'Password must be at least 8 characters.' })
  password: string;
  @Field()
  @IsNotEmpty({ message: 'The password reset Token cannot be empty.' })
  token: string;
}
