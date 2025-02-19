import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('errorType')
export class ErrorType {
  @Field()
  msg: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class CreateResponse {
  @Field()
  code: number;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
