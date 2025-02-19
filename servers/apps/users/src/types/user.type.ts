import { Field, ObjectType } from '@nestjs/graphql';
// import { User } from '../entities/user.entities';

@ObjectType()
export class ErrorType {
  @Field()
  msg: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class BaseResponse {
  @Field()
  code: number;

  @Field({ nullable: true })
  msg?: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class RegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationResponse extends BaseResponse {}

@ObjectType()
export class LoginResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
